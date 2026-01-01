'use client';

import React, { useState, useEffect } from 'react';
import NewUserPopup from './NewUserPopup';

const NewUserPopupManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  // Log popup status for debugging
  console.log("Popup shown status:", hasShownPopup);

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('salescentri_new_user_popup_shown');
    
    // Also check if user is authenticated (don't show popup for logged-in users)
    const isAuthenticated = localStorage.getItem('salescentri_token');
    
    // Check if this is a first-time visitor (no tracker_anon_id)
    const hasTrackerId = localStorage.getItem('tracker_anon_id');
    
    if (!hasSeenPopup && !isAuthenticated && !hasTrackerId) {
      // Show popup after a short delay to ensure page is loaded
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShownPopup(true);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
    
    // Return empty cleanup function when condition is not met
    return () => {};
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as shown in localStorage
    localStorage.setItem('salescentri_new_user_popup_shown', 'true');
  };

  const handleSubmit = async (data: { email: string }) => {
    try {
      // Get anon_id from localStorage
      const anonId = localStorage.getItem('tracker_anon_id');

      // Call external API directly (same as HomepageSalesGPT)
      const baseURL = "https://app.demandintellect.com/app/api";
      let url = `${baseURL}/landing-signups.php`;

      // Add anon_id as query parameter if available
      if (anonId) {
        url += `?anon_id=${anonId}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email.trim(),
          source: 'new_user_popup',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let userFriendlyError = "Something went wrong. Please try again.";

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.reason === "public_email_provider") {
            userFriendlyError = "Please use a business email address instead of a personal email provider.";
          } else if (errorData.error) {
            userFriendlyError = "Please check your information and try again.";
          }
        } catch {
          // If we can't parse the error, use the default message
        }

        throw new Error(userFriendlyError);
      }

      // Mark as shown in localStorage
      localStorage.setItem('salescentri_new_user_popup_shown', 'true');
      
      // Reset form and close popup
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting email:', error);
      throw error;
    }
  };

  return (
    <NewUserPopup
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
};

export default NewUserPopupManager;
