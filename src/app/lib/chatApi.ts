interface ChatMessage {
  id: string | number;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  lightningMode?: any;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
  organization_id?: number;
  anon_id?: string | null;
  mode?: 'lightning' | 'focus' | 'research' | 'brain';
  messages?: ChatMessage[];
}

interface ChatSummary {
  id: string | number;
  chat_id: string;
  summary: string;
  created_at: string;
}

interface CreateChatRequest {
  title: string;
  mode?: string;
  research_type?: string;
  source?: 'homepage' | 'psa-page' | 'psa-chat';
  llm_settings?: {
    category?: string;
    depth?: string;
    [key: string]: any;
  };
}

interface CreateMessageRequest {
  role: 'user' | 'assistant';
  content: string;
  lightningMode?: any;
}

interface OnboardingData {
  id?: number | null;
  organization_id?: number | null;
  anon_id?: string | null;
  sales_objective?: string | null;
  address_by?: string | null;
  company_role?: string | null;
  short_term_goal?: string | null;
  website_url?: string | null;
  gtm?: string | null;
  company_industry?: string | null;
  company_revenue_size?: string | null;
  company_employee_size?: string | null;
  target_departments?: string[] | null;
  target_region?: string | null;
  target_location?: string | null;
  target_audience_list_exist?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Frontend fields that map to backend
  salesObjective?: string;
  userRole?: string;
  immediateGoal?: string;
  companyWebsite?: string;
  marketFocus?: 'B2B' | 'B2C' | 'B2G';
  companyInfo?: {
    industry: string;
    revenueSize: string;
    employeeSize: string;
  };
  userId?: string;
  currentStep?: string;
  completedAt?: string;
}

class ChatApiService {
  private baseUrl = 'https://app.demandintellect.com/app/api';
  
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('salescentri_token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Create anonymous user if not authenticated
  async ensureAnonymousUser(): Promise<void> {
    // Skip if user is authenticated
    if (localStorage.getItem('salescentri_token')) {
      return;
    }

    // Check if we already have a proper backend anon_id (UUID format, not tracker format)
    const existingAnonId = localStorage.getItem('tracker_anon_id');
    if (existingAnonId && !existingAnonId.startsWith('tracker_')) {
      // We already have a proper backend UUID, don't overwrite it
      return;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/anon.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.anon_id) {
          // Only store if we got a valid anon_id from backend
          localStorage.setItem('tracker_anon_id', data.anon_id);
          console.log('✅ ANON USER: Created backend anonymous user:', data.anon_id);
        }
      }
    } catch (error) {
      console.log('❌ ANON USER: Backend creation failed, keeping existing ID:', existingAnonId);
      // Don't create fallback here - let tracker system handle it if needed
    }
  }

  // Get all chats
  async getChats(includeMessages = false): Promise<Chat[]> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    

    
    const params = new URLSearchParams();
    if (includeMessages) {
      params.append('include_messages', 'true');
    }
    
    let url = `${this.baseUrl}/chats.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      params.append('anon_id', anonId);
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      // For authenticated users, use Bearer token
      headers = this.getAuthHeaders();
    } else {
      // For anonymous users, use basic headers
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    // Add query parameters to URL
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    try {
      const response = await fetch(url, {
        headers,
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        return [];
      }
    } catch {
      return [];
    }
  }

  // Get single chat
  async getChat(chatId: string, includeMessages = true): Promise<Chat | null> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    const params = new URLSearchParams();
    params.append('chat_id', chatId);
    if (includeMessages) {
      params.append('include_messages', 'true');
    }
    
    let url = `${this.baseUrl}/chats.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      params.append('anon_id', anonId);
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      // For authenticated users, use Bearer token
      headers = this.getAuthHeaders();
    } else {
      // For anonymous users, use basic headers
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    url += `?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        headers,
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch chat:', response.statusText);
        return null;
      }
          } catch {
        return null;
      }
  }

  // Create new chat (with one retry on failure)
  async createChat(
    title: string, 
    options?: string | {
      mode?: string;
      research_type?: string;
      source?: 'homepage' | 'psa-page' | 'psa-chat';
      llm_settings?: {
        category?: string;
        depth?: string;
        [key: string]: any;
      };
    }
  ): Promise<Chat | null> {
    // Backwards compatibility: if options is a string, treat it as mode
    let requestData: CreateChatRequest;
    if (typeof options === 'string') {
      requestData = { title, mode: options };
    } else if (options) {
      requestData = { title, ...options };
      
      // Auto-configure market_analysis for homepage and PSA page sources
      if ((options.source === 'homepage' || options.source === 'psa-page') && options.mode === 'research') {
        requestData.research_type = 'market_analysis';
        console.log('🎯 CHAT CREATE: Auto-configured research_type to market_analysis for', options.source);
      }
      // For psa-chat source, use user-selected config without forcing market_analysis
      else if (options.source === 'psa-chat') {
        console.log('🎯 CHAT CREATE: Using user-selected config from PSA Chat:', options.llm_settings);
      }
    } else {
      requestData = { title };
    }
    
    const attemptCreate = async (): Promise<Chat | null> => {
      await this.ensureAnonymousUser();
      
      const isAuthenticated = !!localStorage.getItem('salescentri_token');
      const anonId = localStorage.getItem('tracker_anon_id');
      
      // Check if we have a tracker-format ID (not recognized by backend)
      const hasTrackerFormatId = anonId && anonId.startsWith('tracker_');
      
      // Use local API route to avoid CORS issues
      let url = '/api/chat/create';
      let headers: Record<string, string> = { 'Content-Type': 'application/json' };
      
      // Only add anon_id if it's a proper backend UUID (not tracker format)
      if (anonId && !hasTrackerFormatId) {
        const params = new URLSearchParams();
        params.append('anon_id', anonId);
        url += `?${params.toString()}`;
        console.log('🔗 CHAT CREATE: Using backend anon_id:', anonId);
      } else if (hasTrackerFormatId) {
        console.log('⚠️ CHAT CREATE: Skipping tracker-format ID, will use authenticated only');
      }
      
      // Set headers based on authentication status
      if (isAuthenticated) {
        headers = this.getAuthHeaders();
      }
      
      console.log('📤 CHAT CREATE: Sending request with data:', requestData);
      console.log('📤 CHAT CREATE: Request URL:', url);
      console.log('📤 CHAT CREATE: Request headers:', headers);
      console.log('📤 CHAT CREATE: Request body length:', JSON.stringify(requestData).length);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('⏰ CHAT CREATE: Request timeout after 10 seconds');
          controller.abort();
        }, 10000); // 10 second timeout
        
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestData),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ CHAT CREATE: Success with', isAuthenticated ? 'auth token' : 'anon_id');
          return result;
        } else {
          console.log('❌ CHAT CREATE: Failed with status', response.status);
          return null;
        }
      } catch (error) {
        console.log('❌ CHAT CREATE: Network error:', error);
        return null;
      }
    };

    // First attempt
    const created = await attemptCreate();
    if (created) return created;

    // Retry once after re-initializing anon user and a short delay
    try {
      // Try to get a fresh backend anon_id
      const existingAnonId = localStorage.getItem('tracker_anon_id');
      if (existingAnonId && existingAnonId.startsWith('tracker_')) {
        // Remove tracker ID and try to get a real backend ID
        localStorage.removeItem('tracker_anon_id');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch {
      // Continue with retry regardless
    }
    return await attemptCreate();
  }

  // Get messages for a chat
  async getMessages(chatId: string): Promise<ChatMessage[]> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    const params = new URLSearchParams();
    params.append('chat_id', chatId);
    
    let url = `${this.baseUrl}/messages.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      params.append('anon_id', anonId);
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      // For authenticated users, use Bearer token
      headers = this.getAuthHeaders();
    } else {
      // For anonymous users, use basic headers
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    url += `?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        headers,
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch messages:', response.statusText);
        return [];
      }
          } catch {
        return [];
      }
  }

  // Add message to chat
  async addMessage(chatId: string, message: CreateMessageRequest): Promise<ChatMessage | null> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    console.log('addMessage - isAuthenticated:', isAuthenticated);
    console.log('addMessage - anonId:', anonId);
    console.log('addMessage - chatId:', chatId);
    console.log('addMessage - message:', message);
    
    const params = new URLSearchParams();
    params.append('chat_id', chatId);
    
    let url = `${this.baseUrl}/messages.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      params.append('anon_id', anonId);
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      // For authenticated users, use Bearer token
      headers = this.getAuthHeaders();
    } else {
      // For anonymous users, use basic headers
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    url += `?${params.toString()}`;
    
    console.log('addMessage - URL:', url);
    console.log('addMessage - Headers:', headers);
    
    try {
      // Sanitize and serialize payload for backend expectations
      const role: 'user' | 'assistant' = message.role === 'assistant' ? 'assistant' : 'user';
      const payload: Record<string, unknown> = {
        role,
        content: String(message.content ?? ''),
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      
      console.log('addMessage - Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('addMessage - Success:', result);
        return result;
      } else {
        const errorText = await response.text();
        console.error('Failed to add message:', response.statusText, 'Response:', errorText);
        return null;
      }
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }

  // Delete chat
  async deleteChat(chatId: string): Promise<boolean> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    const params = new URLSearchParams();
    params.append('chat_id', chatId);
    
    let url = `${this.baseUrl}/chats.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      params.append('anon_id', anonId);
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      // For authenticated users, use Bearer token
      headers = this.getAuthHeaders();
    } else {
      // For anonymous users, use basic headers
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    url += `?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting chat:', error);
      return false;
    }
  }

  // Update chat (e.g., title)
  async updateChat(chatId: string, updates: { title?: string }): Promise<Chat | null> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    console.log('updateChat - isAuthenticated:', isAuthenticated);
    console.log('updateChat - anonId:', anonId);
    console.log('updateChat - chatId:', chatId);
    console.log('updateChat - updates:', updates);
    
    const params = new URLSearchParams();
    params.append('chat_id', chatId);
    
    let url = `${this.baseUrl}/chats.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      params.append('anon_id', anonId);
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      // For authenticated users, use Bearer token
      headers = this.getAuthHeaders();
    } else {
      // For anonymous users, use basic headers
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    url += `?${params.toString()}`;
    
    console.log('updateChat - URL:', url);
    console.log('updateChat - Headers:', headers);
    console.log('updateChat - Request body:', JSON.stringify(updates));
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });
      
      console.log('updateChat - Response status:', response.status);
      console.log('updateChat - Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const result = await response.json();
        console.log('updateChat - Success:', result);
        return result.data || result; // Handle both response formats
      } else {
        const errorText = await response.text();
        console.error('Failed to update chat:', response.statusText, 'Response:', errorText);
        console.error('updateChat - Full response object:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        return null;
      }
    } catch (error) {
      console.error('Error updating chat:', error);
      return null;
    }
  }

  // Chat Summary Methods

  // Create chat summary
  async createChatSummary(chatId: string, summary: string): Promise<ChatSummary | null> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    let url = `${this.baseUrl}/chat-summary.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      const params = new URLSearchParams();
      params.append('anon_id', anonId);
      url += `?${params.toString()}`;
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      headers = this.getAuthHeaders();
    } else {
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          chat_id: chatId,
          summary: summary,
        }),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to create chat summary:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error creating chat summary:', error);
      return null;
    }
  }

  // Get chat summary
  async getChatSummary(chatId: string): Promise<ChatSummary | null> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    const params = new URLSearchParams();
    params.append('chat_id', chatId);
    
    let url = `${this.baseUrl}/chat-summary.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      params.append('anon_id', anonId);
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      headers = this.getAuthHeaders();
    } else {
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    url += `?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        headers,
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to get chat summary:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error getting chat summary:', error);
      return null;
    }
  }

  // Update chat summary
  async updateChatSummary(summaryId: string, summary: string): Promise<ChatSummary | null> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    const params = new URLSearchParams();
    params.append('id', summaryId);
    
    let url = `${this.baseUrl}/chat-summary.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      params.append('anon_id', anonId);
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      headers = this.getAuthHeaders();
    } else {
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    url += `?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          summary: summary,
        }),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to update chat summary:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error updating chat summary:', error);
      return null;
    }
  }

  // Delete chat summary
  async deleteChatSummary(summaryId: string): Promise<boolean> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    const params = new URLSearchParams();
    params.append('id', summaryId);
    
    let url = `${this.baseUrl}/chat-summary.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      params.append('anon_id', anonId);
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      headers = this.getAuthHeaders();
    } else {
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    url += `?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting chat summary:', error);
      return false;
    }
  }

  // Get onboarding data
  async getOnboardingData(): Promise<OnboardingData | null> {
    await this.ensureAnonymousUser();
    
    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');
    
    // Use the same PHP endpoint used by conversational onboarding to keep data consistent
    let url = `${this.baseUrl}/onboarding.php`;
    let headers: Record<string, string>;
    
    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      const params = new URLSearchParams();
      params.append('anon_id', anonId);
      url += `?${params.toString()}`;
    }
    
    // Set headers based on authentication status
    if (isAuthenticated) {
      headers = this.getAuthHeaders();
    } else {
      headers = {
        'Content-Type': 'application/json',
      };
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (response.ok) {
        const raw = await response.json();
        // The backend may return {onboarding}, {data: {onboarding}}, an array, or a flat object.
        // Prefer a concrete onboarding object if present; otherwise return raw as-is for caller normalization.
        const container = (raw && (raw.onboarding || raw.data || raw)) as unknown;
        // If container includes an array under onboarding_list, pick the latest entry
        if (
          container &&
          typeof container === 'object' &&
          'onboarding_list' in (container as Record<string, unknown>) &&
          Array.isArray((container as Record<string, unknown>).onboarding_list)
        ) {
          const list = (container as { onboarding_list: Array<Record<string, unknown>> }).onboarding_list;
          if (list.length > 0) {
            // Pick most recent by id if present
            const latest = [...list].sort((a, b) => Number((b as any).id ?? 0) - Number((a as any).id ?? 0))[0];
            return latest as unknown as OnboardingData;
          }
        }
        console.log('Fetched onboarding data (normalized container):', container);
        return container as OnboardingData;
      } else if (response.status === 404) {
        // No data exists yet, return empty structure
        return null;
      } else {
        console.error('Failed to fetch onboarding data:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      return null;
    }
  }

  // Save onboarding data (create or update)
  async saveOnboardingData(data: Record<string, string | number | boolean | object | undefined>): Promise<OnboardingData | null> {
    await this.ensureAnonymousUser();

    const isAuthenticated = !!localStorage.getItem('salescentri_token');
    const anonId = localStorage.getItem('tracker_anon_id');

    // Allowed enums for new onboarding schema
    const enums = {
      sales_objective: [
        'Generate qualified leads',
        'Expand into a new region or sector',
        'Enrich or clean an existing list',
        'Purchase a new contact list',
      ],
      address_by: ['first_name', 'last_name', 'job_title'],
      company_role: [
        'Founder / CEO',
        'Sales Director or Manager',
        'Marketing Director or Manager',
        'Sales Development Representative (SDR)',
        'Consultant / Advisor',
        'Other',
      ],
      short_term_goal: [
        'Schedule a demo',
        'Purchase or download contacts',
        'Enrich my existing list',
        'Create a new list from scratch',
        'Get advice on strategy',
      ],
      gtm: ['B2B', 'B2C', 'B2G', 'BOTH'],
      company_industry: [
        'Accounting/Finance', 'Advertising/Public Relations', 'Aerospace/Aviation', 'Agriculture/Livestock',
        'Animal Care/Pet Services', 'Arts/Entertainment/Publishing', 'Automotive', 'Banking/Mortgage',
        'Business Development', 'Business Opportunity', 'Clerical/Administrative', 'Construction/Facilities',
        'Education/Research', 'Energy/Utilities', 'Food/Beverage', 'Government/Non-Profit',
        'Healthcare/Wellness', 'Legal/Security', 'Manufacturing/Industrial', 'Real Estate/Property',
        'Retail/Wholesale', 'Technology/IT', 'Transportation/Logistics', 'Other', 'NA',
      ],
      company_revenue_size: [
        '0-500K', '500K-1M', '1M-5M', '5M-10M', '10M-50M', '50M-100M', '100M-500M',
        '500M-1B', '1B-5B', '5B+', 'NA',
      ],
      company_employee_size: [
        '0-10', '11-50', '51-200', '201-500', '501-1000', '1000-5000', '5001-10000',
        '10001-50000', '50001-100000', '100000+', 'NA',
      ],
      target_region: [
        'India', 'North America', 'Europe', 'Asia-Pacific', 'Global / Multiple regions',
      ],
    } as const;

    type EnumKey = keyof typeof enums;

    // Helper to map or set _raw
    function mapEnum(field: string, value: unknown): { value?: string, raw?: string } {
      if (value == null) return {};
      const enumValues = (enums as Record<string, readonly string[]>)[field];
      if (enumValues && enumValues.includes(String(value))) {
        return { value: String(value) };
      } else if (typeof value === 'string' && value.trim() !== '') {
        // fallback: set to 'Other' or first enum if exists, and set _raw
        let fallback = 'Other';
        if (field === 'address_by') fallback = 'first_name';
        if (enumValues && enumValues.includes(fallback)) {
          return { value: fallback, raw: value };
        } else if (enumValues) {
          return { value: enumValues[0], raw: value };
        }
        return { raw: value };
      }
      return {};
    }

    // Build backendData
    const backendData: Record<string, unknown> = {};

    // Map all fields
    const fieldMap: [EnumKey | 'website_url', unknown][] = [
      ['sales_objective', data.salesObjective],
      ['address_by', data.addressBy],
      ['company_role', data.userRole],
      ['short_term_goal', data.immediateGoal],
      ['website_url', data.companyWebsite],
      ['gtm', data.marketFocus],
    ];
    for (const [field, value] of fieldMap) {
      if (field === 'website_url') {
        if (value) backendData[field] = value;
        continue;
      }
      const mapped = mapEnum(field, value);
      if (mapped.value) backendData[field] = mapped.value;
      if (mapped.raw) backendData[`${field}_raw`] = mapped.raw;
    }

    // Company info
    if (data.companyInfo && typeof data.companyInfo === 'object') {
      const companyInfo = data.companyInfo as { industry?: string; revenueSize?: string; employeeSize?: string };
      const ciMap: [EnumKey, unknown][] = [
        ['company_industry', companyInfo.industry],
        ['company_revenue_size', companyInfo.revenueSize],
        ['company_employee_size', companyInfo.employeeSize],
      ];
      for (const [field, value] of ciMap) {
        const mapped = mapEnum(field, value);
        if (mapped.value) backendData[field] = mapped.value;
        if (mapped.raw) backendData[`${field}_raw`] = mapped.raw;
      }
    }

    // Target industries (array only)
    if (Array.isArray((data as any).targetIndustries) && (data as any).targetIndustries.length > 0) {
      backendData.target_industries = (data as any).targetIndustries;
    }

    // Target departments (array)
    if (data.targetDepartments) backendData.target_departments = data.targetDepartments;
    // Target region
    const region = mapEnum('target_region', data.targetRegion);
    if (region.value) backendData.target_region = region.value;
    if (region.raw) backendData['target_region_raw'] = region.raw;
    // Target location (text)
    if (data.targetLocation) backendData.target_location = data.targetLocation;
    // Target audience list exist (boolean)
    if (typeof data.targetAudienceListExist !== 'undefined') backendData.target_audience_list_exist = data.targetAudienceListExist;

    // Address by value fields
    if (data.addressBy === 'first_name' && data.firstName) backendData.first_name = data.firstName;
    if (data.addressBy === 'last_name' && data.lastName) backendData.last_name = data.lastName;
    if (data.addressBy === 'job_title' && data.jobTitle) backendData.job_title = data.jobTitle;

    // Use the PHP endpoint to match conversational onboarding persistence
    let url = `${this.baseUrl}/onboarding.php`;
    let headers: Record<string, string>;

    // Always add anon_id as query parameter if it exists, regardless of authentication
    if (anonId) {
      const params = new URLSearchParams();
      params.append('anon_id', anonId);
      url += `?${params.toString()}`;
    }

    // Set headers based on authentication status
    if (isAuthenticated) {
      headers = this.getAuthHeaders();
    } else {
      headers = {
        'Content-Type': 'application/json',
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        const result = await response.json();
        // Similar normalization as get: accept {onboarding} | {data: {...}} | flat
        const container = (result && (result.onboarding || result.data || result)) as OnboardingData;
        console.log('Saved onboarding data (normalized):', container);
        return container;
      } else {
        console.error('Failed to save onboarding data:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      return null;
    }
  }
}

export const chatApi = new ChatApiService();
export type { Chat, ChatMessage, CreateChatRequest, CreateMessageRequest, OnboardingData };
