import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, CheckCircle } from 'lucide-react';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface OnboardingProgress {
  isComplete: boolean;
  nextField: string | null;
  currentState: Record<string, unknown>;
  extractedValues: Record<string, unknown>;
  redirectToDashboard?: boolean;
}

interface ConversationalOnboardingProps {
  chatId: string;
  onComplete: (onboardingData: Record<string, unknown>) => void;
  isLoading: boolean;
  anonymousUserId?: string;
}

const ConversationalOnboarding: React.FC<ConversationalOnboardingProps> = ({
  chatId,
  onComplete,
  isLoading: externalLoading,
  anonymousUserId: providedAnonymousUserId
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress | null>(null);
  const [anonymousUserId, setAnonymousUserId] = useState<string | undefined>(providedAnonymousUserId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use existing tracker-provided anon_id if available
  useEffect(() => {
    if (!providedAnonymousUserId && typeof window !== 'undefined') {
      const trackerAnon = localStorage.getItem('tracker_anon_id') || undefined;
      if (trackerAnon && !anonymousUserId) {
        setAnonymousUserId(trackerAnon);
      }
    }
  }, [anonymousUserId, providedAnonymousUserId]);

  // Initial welcome message and start onboarding
  useEffect(() => {
    const initializeOnboarding = async () => {
      // Don't initialize multiple times
      if (messages.length > 0) return;
      
      try {
        setIsLoading(true);
        
        // Send START_ONBOARDING message to get the current state and appropriate question
        let url = '/api/onboarding/chat';
        if (anonymousUserId) {
          const params = new URLSearchParams();
          params.append('anon_id', anonymousUserId);
          url += `?${params.toString()}`;
        }

        // Include Authorization header if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('salescentri_token') : null;
        const initHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          initHeaders['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: initHeaders,
          body: JSON.stringify({
            message: 'START_ONBOARDING',
            chatId,
            conversationHistory: []
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Set initial message from backend response
          const initialMessage: ConversationMessage = {
            role: 'assistant',
            content: data.result || data.response || `Welcome to Sales Centri! 🎯 Let's get you set up with a personalized onboarding experience.`,
            timestamp: Date.now()
          };
          
          setMessages([initialMessage]);
          
          // Update onboarding progress
          if (data.onboarding) {
            setOnboardingProgress(data.onboarding);
          }
        } else {
          // Fallback welcome message
          const welcomeMessage: ConversationMessage = {
            role: 'assistant',
            content: `Welcome to Sales Centri! 🎯 Let's get you set up with a personalized onboarding experience.`,
            timestamp: Date.now()
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Error initializing onboarding:', error);
        // Fallback welcome message
        const welcomeMessage: ConversationMessage = {
          role: 'assistant',
          content: `Welcome to Sales Centri! 🎯 Let's get you set up with a personalized onboarding experience.`,
          timestamp: Date.now()
        };
        setMessages([welcomeMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only initialize when we have anonymousUserId or if we're not waiting for it
    if (anonymousUserId || providedAnonymousUserId) {
      initializeOnboarding();
    }
  }, [anonymousUserId, providedAnonymousUserId, chatId, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle onboarding completion
  useEffect(() => {
    if (onboardingProgress?.isComplete && onboardingProgress?.redirectToDashboard) {
      onComplete(onboardingProgress.currentState);
    }
  }, [onboardingProgress, onComplete]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ConversationMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: Date.now()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare URL with anon_id query parameter if needed
      let url = '/api/onboarding/chat';
      if (anonymousUserId) {
        const params = new URLSearchParams();
        params.append('anon_id', anonymousUserId);
        url += `?${params.toString()}`;
      }

      // Include Authorization header if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('salescentri_token') : null;
      const initHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        initHeaders['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: initHeaders,
        body: JSON.stringify({
          message: inputMessage,
          chatId,
          // Send history BEFORE adding the latest user message to avoid double-counting
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          })),
          // Remove anonymousUserId from body since we're using anon_id query parameter
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add assistant response
      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: data.result || data.response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update onboarding progress
      if (data.onboarding) {
        setOnboardingProgress(data.onboarding);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ConversationMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getProgressPercentage = (): number => {
    if (!onboardingProgress) return 0;
    
    // Define required fields based on API documentation
    const requiredFields = [
      'sales_objective',
      'company_role', 
      'short_term_goal',
      'website_url',
      'gtm',
      'target_industries',
      'target_revenue_size',
      'target_employee_size',
      'target_departments',
      'target_region',
      'target_location'
      // target_audience_list_exist is optional according to API docs
    ];
    
    const completedRequiredFields = requiredFields.filter(field => 
      onboardingProgress.currentState[field] !== undefined && 
      onboardingProgress.currentState[field] !== null &&
      onboardingProgress.currentState[field] !== ''
    ).length;
    
    return Math.min((completedRequiredFields / requiredFields.length) * 100, 100);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header with Progress */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Bot className="w-6 h-6 mr-2 text-blue-400" />
            Sales Centri Onboarding
          </h2>
          {onboardingProgress?.isComplete && (
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete!
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {onboardingProgress?.isComplete 
            ? 'Onboarding complete!' 
            : `Progress: ${Math.round(getProgressPercentage())}%`
          }
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/20">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Message Bubble */}
                <div className={`rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-200 border border-gray-700'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex mr-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!onboardingProgress?.isComplete && (
        <div className="border-t border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response here..."
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                rows={1}
                disabled={isLoading || externalLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || externalLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      )}

      {/* Completion Message */}
      {onboardingProgress?.isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-700 bg-gradient-to-r from-green-900/20 to-blue-900/20 p-6 backdrop-blur-sm text-center"
        >
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Onboarding Complete!</h3>
          <p className="text-gray-300 mb-4">
            Great! I have all the information I need to create your personalized sales strategy.
          </p>
          <div className="text-sm text-gray-400">
            Redirecting to your dashboard in a moment...
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ConversationalOnboarding;
