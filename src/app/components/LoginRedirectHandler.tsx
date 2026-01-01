'use client';

import { useEffect } from 'react';
import { saveTokens, type AuthTokens } from '../lib/auth';
import { resetQueryCount } from '../lib/queryLimit';

export const LoginRedirectHandler: React.FC = () => {
  useEffect(() => {
    const handleAuthRedirect = () => {
      if (typeof window === 'undefined') return;
      
      console.log('🔐 LoginRedirectHandler: Checking for auth parameters...');
      
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const refreshToken = urlParams.get('refreshToken');
      const expiresAt = urlParams.get('expiresAt');
      
      console.log('🔐 Auth parameters found:', {
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        hasExpiresAt: !!expiresAt,
        currentUrl: window.location.href
      });
      
      if (token && refreshToken && expiresAt) {
        // Save tokens to localStorage with salescentri_ prefix
        const authTokens: AuthTokens = {
          token,
          refreshToken,
          expiresAt
        };
        
        saveTokens(authTokens);
        
        // Reset query count for authenticated users
        resetQueryCount();
        
        // Clean up URL params
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // Optional: Show success notification
        console.log('Authentication successful - tokens stored');
        
        // Check if there's a preserved chat from anonymous session
        const preservedChat = localStorage.getItem('salescentri_preserved_chat');
        console.log('🔐 Preserved chat check:', {
          hasPreservedChat: !!preservedChat,
          preservedChatLength: preservedChat ? preservedChat.length : 0
        });
        
        if (preservedChat) {
          console.log('🔄 PRESERVED CHAT DETECTED after login - setting focus mode flag');
          // Set flag to show focus mode modal with continue chat option
          localStorage.setItem('showFocusModeModal', 'true');
          console.log('🔄 Focus mode flag set:', localStorage.getItem('showFocusModeModal'));
        } else {
          console.log('🔄 No preserved chat - setting onboarding flag');
          // Set flag to show regular onboarding modal
          localStorage.setItem('showOnboardingModal', 'true');
          console.log('🔄 Onboarding flag set:', localStorage.getItem('showOnboardingModal'));
        }
      }
    };
    
    handleAuthRedirect();
  }, []);
  
  return null; // This component doesn't render anything
};
