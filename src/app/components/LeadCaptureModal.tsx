'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Mail, Phone, Shield, ArrowRight, ArrowLeft, CheckCircle, Loader2, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import OTPInput from './OTPInput';
import ObjectiveSelector, { ObjectiveType } from './ObjectiveSelector';
import { isCorporateEmail, isFreeEmailProvider } from '@/app/lib/corporateEmail';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5; // 4 is success, 5 is voice agent

interface FormData {
  email: string;
  phone: string;
  otp: string;
  objective: ObjectiveType | null;
  signedToken?: string; // For production OTP verification
}

interface CallTracking {
  leadId: string | null;
  callStartTime: number | null;
  callEndTime: number | null;
  isCallActive: boolean;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// TypeScript declaration for ElevenLabs custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id'?: string;
        'data-objective'?: string;
        'data-email'?: string;
        'data-phone'?: string;
      };
    }
  }
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    otp: '',
    objective: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [autoVerifyAttempted, setAutoVerifyAttempted] = useState(false);
  const [callTracking, setCallTracking] = useState<CallTracking>({
    leadId: null,
    callStartTime: null,
    callEndTime: null,
    isCallActive: false,
  });
  const [isInitializingCall, setIsInitializingCall] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const voiceWidgetRef = useRef<HTMLElement | null>(null);
  const watermarkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle ESC key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleFocusTrap);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent scroll on touch devices
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Reset step when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    return isCorporateEmail(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone) && phone.length >= 10;
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Validate email (must be corporate email)
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      if (isFreeEmailProvider(formData.email)) {
        newErrors.email = 'Please use your business email address. Personal email addresses (e.g., Gmail, Yahoo) are not accepted.';
      } else {
        newErrors.email = 'Please enter a valid corporate email';
      }
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Get reCAPTCHA token
        const siteKey = '6LcBMxgsAAAAAPGN83gm3_o0kJC-6X07d7ECwsZ2';

        // Check if grecaptcha is loaded
        if (!window.grecaptcha) {
          console.error('reCAPTCHA script not loaded');
          setErrors({ email: 'Security verification not available. Please refresh the page.' });
          setIsLoading(false);
          return;
        }

        // Wait for grecaptcha to be ready
        await new Promise<void>((resolve) => {
          window.grecaptcha.ready(() => {
            console.log('reCAPTCHA ready');
            resolve();
          });
        });

        console.log('Executing reCAPTCHA with site key:', siteKey);
        const token = await window.grecaptcha.execute(siteKey, { action: 'submit' });
        console.log('reCAPTCHA token obtained');

        // Call API to send OTP with reCAPTCHA token
        const response = await fetch('/api/lead-capture/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: formData.email, 
            phone: formData.phone,
            recaptchaToken: token 
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Store signed token for verification in production
          setFormData(prev => ({ ...prev, signedToken: data.signedToken }));
          setStep(2);
        } else {
          const error = await response.json();
          setErrors({ email: error.message || 'Failed to send OTP' });
        }
      } catch (error) {
        setErrors({ email: error instanceof Error ? error.message : 'An error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const verifyOTP = async (otpValue: string) => {
    if (otpValue.length !== 6) return;
    
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Call API to verify OTP
      const response = await fetch('/api/lead-capture/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: otpValue,
          signedToken: formData.signedToken // Include for production verification
        }),
      });

      if (response.ok) {
        setStep(3);
        setAutoVerifyAttempted(false); // Reset for next time
      } else {
        const error = await response.json();
        setErrors({ otp: error.message || 'Invalid OTP' });
      }
    } catch (error) {
      setErrors({ otp: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-verify OTP when 6 digits are entered
  useEffect(() => {
    if (step === 2 && formData.otp.length === 6 && !isLoading && !autoVerifyAttempted && !errors.otp) {
      setAutoVerifyAttempted(true);
      verifyOTP(formData.otp);
    }
    // Reset auto-verify flag when OTP changes
    if (formData.otp.length < 6) {
      setAutoVerifyAttempted(false);
    }
  }, [formData.otp, step, isLoading, autoVerifyAttempted, errors.otp]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOTP(formData.otp);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.objective) {
      newErrors.objective = 'Please select an objective';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Call API to submit lead
        const response = await fetch('/api/lead-capture/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            phone: formData.phone,
            objective: formData.objective,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setCallTracking(prev => ({ ...prev, leadId: data.leadId }));
          setStep(4);
          // Transition to Step 5 after 2 seconds instead of closing
          setTimeout(() => {
            setStep(5);
          }, 2000);
        } else {
          const error = await response.json();
          setErrors({ objective: error.message || 'Failed to submit' });
        }
      } catch (error) {
        setErrors({ objective: 'An error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    // Clean up watermark interval
    if (watermarkIntervalRef.current) {
      clearInterval(watermarkIntervalRef.current);
      watermarkIntervalRef.current = null;
    }
    
    // Clean up MutationObserver
    const container = document.getElementById('voice-agent-container');
    if (container && (container as any).__watermarkObserver) {
      (container as any).__watermarkObserver.disconnect();
      delete (container as any).__watermarkObserver;
    }
    
    // Clean up voice widget if active
    if (voiceWidgetRef.current) {
      voiceWidgetRef.current.remove();
      voiceWidgetRef.current = null;
    }
    
    // Remove custom embed styles
    const style = document.getElementById('elevenlabs-embed-style');
    if (style) {
      style.remove();
    }
    
    onClose();
    setTimeout(() => {
      setStep(1);
      setFormData({ email: '', phone: '', otp: '', objective: null });
      setErrors({});
      setAutoVerifyAttempted(false);
      setIsInitializingCall(false);
      setCallTracking({
        leadId: null,
        callStartTime: null,
        callEndTime: null,
        isCallActive: false,
      });
    }, 300);
  };

  const handleStartCall = () => {
    console.log('[Voice Agent] Starting call...');
    setIsInitializingCall(true);
    
    // Set the call as active to render the container
    setCallTracking(prev => ({
      ...prev,
      callStartTime: Date.now(),
      isCallActive: true,
    }));
    
    // Note: Lead data (email/phone/subject) is already stored when form is submitted
    // via /api/lead-capture/submit, so webhook can find it
    
    console.log('[Voice Agent] Call state updated, container should render now');
  };

  // Effect to inject widget when call becomes active
  useEffect(() => {
    if (!callTracking.isCallActive || voiceWidgetRef.current) return;

    console.log('[Voice Agent] Call is active, injecting widget...');
    
    // Wait a moment for state to settle
    const timer = setTimeout(() => {
      const container = document.getElementById('voice-agent-container');
      
      if (!container) {
        console.error('[Voice Agent] Container not found!');
        setIsInitializingCall(false);
        setCallTracking(prev => ({ ...prev, isCallActive: false }));
        return;
      }

      try {
        // Check if ElevenLabs script loaded
        console.log('[Voice Agent] Checking for ElevenLabs script...');
        
        if (!customElements.get('elevenlabs-convai')) {
          console.error('[Voice Agent] ElevenLabs custom element not registered! Script may not be loaded.');
          alert('Voice agent failed to load. Please refresh the page and try again.');
          setIsInitializingCall(false);
          setCallTracking(prev => ({ ...prev, isCallActive: false }));
          return;
        }

        // Create and inject ElevenLabs widget with inline styles
        const widget = document.createElement('elevenlabs-convai') as HTMLElement;
        widget.setAttribute('agent-id', 'agent_7701kbcrdr3zemzajc9ct39m2q9y');
        widget.style.width = '100%';
        widget.style.height = '100%';
        widget.style.display = 'block';
        
        // Pass context data
        if (formData.objective) {
          widget.setAttribute('data-objective', formData.objective);
          console.log('[Voice Agent] Objective:', formData.objective);
        }
        if (formData.email) {
          widget.setAttribute('data-email', formData.email);
          console.log('[Voice Agent] Email:', formData.email);
        }
        if (formData.phone) {
          widget.setAttribute('data-phone', formData.phone);
          console.log('[Voice Agent] Phone:', formData.phone);
        }
        
        console.log('[Voice Agent] Widget created with inline styles');
        
        // Clear container and append widget
        container.innerHTML = '';
        container.appendChild(widget);
        voiceWidgetRef.current = widget;
        console.log('[Voice Agent] Widget appended to container successfully');

        // Add global styles to force widget to stay embedded and hide watermark
        const style = document.createElement('style');
        style.id = 'elevenlabs-embed-style';
        style.textContent = `
          /* Force Convai widget to stay embedded */
          #voice-agent-container elevenlabs-convai {
            position: relative !important;
            bottom: auto !important;
            right: auto !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            z-index: 1 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
            display: block !important;
          }
          
          /* Hide default floating button */
          elevenlabs-convai::part(button),
          elevenlabs-convai [part="button"] {
            display: none !important;
          }
          
          /* Ensure widget content fills container */
          #voice-agent-container elevenlabs-convai > * {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
          
          /* Make sure the widget itself is visible */
          #voice-agent-container elevenlabs-convai {
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
          }
          
          /* Aggressive watermark hiding - all possible selectors */
          #voice-agent-container elevenlabs-convai *[class*="powered"],
          #voice-agent-container elevenlabs-convai *[class*="watermark"],
          #voice-agent-container elevenlabs-convai *[class*="branding"],
          #voice-agent-container elevenlabs-convai *[class*="footer"],
          #voice-agent-container elevenlabs-convai *[class*="attribution"],
          #voice-agent-container elevenlabs-convai *[class*="credit"],
          #voice-agent-container elevenlabs-convai a[href*="elevenlabs"],
          #voice-agent-container elevenlabs-convai a[href*="elevenlabs.io"],
          #voice-agent-container elevenlabs-convai *[data-testid*="powered"],
          #voice-agent-container elevenlabs-convai *[aria-label*="Powered"],
          #voice-agent-container elevenlabs-convai *[title*="Powered"],
          #voice-agent-container elevenlabs-convai *[aria-label*="ElevenLabs"],
          #voice-agent-container elevenlabs-convai *[title*="ElevenLabs"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            clip: rect(0, 0, 0, 0) !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            font-size: 0 !important;
            line-height: 0 !important;
            pointer-events: none !important;
          }
          
          /* Hide bottom positioned elements (common watermark location) */
          #voice-agent-container elevenlabs-convai *[style*="bottom"],
          #voice-agent-container elevenlabs-convai *[style*="position: fixed"][style*="bottom"],
          #voice-agent-container elevenlabs-convai *[style*="position: absolute"][style*="bottom"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            pointer-events: none !important;
          }
          
          /* Crop bottom 40px where watermark typically appears - using padding-bottom trick */
          #voice-agent-container {
            overflow: hidden !important;
            position: relative !important;
            padding-bottom: 0 !important;
          }
          
          /* Ensure widget iframe/content is properly sized */
          #voice-agent-container elevenlabs-convai iframe,
          #voice-agent-container elevenlabs-convai webview,
          #voice-agent-container elevenlabs-convai > div {
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
            display: block !important;
          }
          
          /* Subtle bottom shadow to hide watermark only - slightly stronger */
          #voice-agent-container::after {
            content: '' !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 40px !important;
            background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.85) 40%, rgba(0, 0, 0, 0.98) 70%, #000000 100%) !important;
            pointer-events: none !important;
            z-index: 10 !important;
          }
          
          /* Hide any text nodes containing watermark text */
          #voice-agent-container * {
            position: relative;
          }
        `;
        document.head.appendChild(style);
        console.log('[Voice Agent] Embed styles applied');

        // Advanced watermark hiding function with multiple strategies
        const hideWatermark = () => {
          const container = document.getElementById('voice-agent-container');
          if (!container) return;
          
          // Strategy 1: Text-based detection - find elements containing watermark text
          const allElements = container.querySelectorAll('*');
          allElements.forEach((el) => {
            const text = (el.textContent || '').trim().toLowerCase();
            const html = (el.innerHTML || '').toLowerCase();
            const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
            const title = (el.getAttribute('title') || '').toLowerCase();
            
            // Check for watermark keywords
            const watermarkKeywords = [
              'powered by',
              'elevenlabs',
              'eleven labs',
              'elevenlabs agents',
              'elevenlabs.io',
            ];
            
            const hasWatermark = watermarkKeywords.some(keyword => 
              text.includes(keyword) || 
              html.includes(keyword) || 
              ariaLabel.includes(keyword) || 
              title.includes(keyword)
            );
            
            if (hasWatermark) {
              const htmlEl = el as HTMLElement;
              htmlEl.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                clip: rect(0, 0, 0, 0) !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                font-size: 0 !important;
                line-height: 0 !important;
                pointer-events: none !important;
                z-index: -9999 !important;
              `;
              // Also remove from DOM if it's a leaf node
              if (el.children.length === 0) {
                try {
                  el.remove();
                } catch (e) {
                  // Ignore removal errors
                }
              }
            }
          });
          
          // Strategy 2: Position-based detection - hide bottom-positioned elements
          const bottomElements = Array.from(allElements).filter((el) => {
            const htmlEl = el as HTMLElement;
            const style = window.getComputedStyle(htmlEl);
            const rect = htmlEl.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // Check if element is positioned at bottom of container
            const isAtBottom = (
              (style.position === 'absolute' || style.position === 'fixed') &&
              (rect.bottom >= containerRect.bottom - 60) && // Within 60px of bottom
              rect.height < 100 // Small elements (likely watermark)
            );
            
            return isAtBottom;
          });
          
          bottomElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const text = (htmlEl.textContent || '').toLowerCase();
            if (text.includes('powered') || text.includes('elevenlabs')) {
              htmlEl.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                pointer-events: none !important;
              `;
            }
          });
          
          // Strategy 3: Selector-based detection
          const watermarkSelectors = [
            '[class*="powered"]',
            '[class*="watermark"]',
            '[class*="branding"]',
            '[class*="footer"]',
            '[class*="attribution"]',
            '[class*="credit"]',
            '[data-testid*="powered"]',
            '[aria-label*="Powered"]',
            '[aria-label*="ElevenLabs"]',
            '[title*="Powered"]',
            '[title*="ElevenLabs"]',
            'a[href*="elevenlabs"]',
            'a[href*="elevenlabs.io"]',
          ];
          
          watermarkSelectors.forEach((selector) => {
            try {
              const elements = container.querySelectorAll(selector);
              elements.forEach((el) => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.cssText = `
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  height: 0 !important;
                  pointer-events: none !important;
                `;
              });
            } catch (e) {
              // Ignore invalid selectors
            }
          });
        };
        
        // Hide watermark immediately
        hideWatermark();
        
        // Use MutationObserver to catch dynamically added content
        const observer = new MutationObserver((mutations) => {
          let shouldHide = false;
          mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
              shouldHide = true;
            }
          });
          if (shouldHide) {
            hideWatermark();
          }
        });
        
        // Observe the container for changes
        observer.observe(container, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
        });
        
        // Store observer for cleanup
        (container as any).__watermarkObserver = observer;
        
        // Also hide watermark periodically as backup
        watermarkIntervalRef.current = setInterval(() => {
          hideWatermark();
        }, 300);
        
        // Clear interval after 15 seconds (widget should be fully loaded by then)
        setTimeout(() => {
          if (watermarkIntervalRef.current) {
            clearInterval(watermarkIntervalRef.current);
            watermarkIntervalRef.current = null;
          }
          // Keep observer running but reduce frequency
          if ((container as any).__watermarkObserver) {
            // Observer continues to watch for changes
          }
        }, 15000);

        setIsInitializingCall(false);
        console.log('[Voice Agent] Initialization complete. Widget should be embedded in container.');
      } catch (error) {
        console.error('[Voice Agent] Error creating widget:', error);
        alert('Failed to start voice call. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
        setIsInitializingCall(false);
        setCallTracking(prev => ({ ...prev, isCallActive: false }));
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [callTracking.isCallActive, formData.objective, formData.email, formData.phone]);

  const handleEndCall = async () => {
    const endTime = Date.now();
    const duration = callTracking.callStartTime ? Math.floor((endTime - callTracking.callStartTime) / 1000) : 0;

    // Track call data
    try {
      await fetch('/api/lead-capture/track-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: callTracking.leadId,
          email: formData.email,
          phone: formData.phone, // Include phone for webhook matching
          objective: formData.objective,
          callDuration: duration,
          callStartTime: callTracking.callStartTime,
          callEndTime: endTime,
        }),
      });
    } catch (error) {
      console.error('Failed to track call:', error);
    }

    // Clean up watermark interval
    if (watermarkIntervalRef.current) {
      clearInterval(watermarkIntervalRef.current);
      watermarkIntervalRef.current = null;
    }
    
    // Clean up MutationObserver
    const container = document.getElementById('voice-agent-container');
    if (container && (container as any).__watermarkObserver) {
      (container as any).__watermarkObserver.disconnect();
      delete (container as any).__watermarkObserver;
    }
    
    // Clean up widget and styles
    if (voiceWidgetRef.current) {
      voiceWidgetRef.current.remove();
      voiceWidgetRef.current = null;
    }

    // Close modal
    handleClose();
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/lead-capture/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, phone: formData.phone }),
      });
      // Show success message or toast
    } catch (error) {
      console.error('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wheel events to prevent background scrolling
  const handleContentWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isScrollable = scrollHeight > clientHeight;
    
    // Always stop propagation to prevent background scroll
    e.stopPropagation();
    
    if (!isScrollable) {
      // If content is not scrollable, prevent the event entirely
      e.preventDefault();
      return;
    }

    // Check if we're at boundaries
    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const scrollingDown = e.deltaY > 0;
    const scrollingUp = e.deltaY < 0;

    // If at boundary and trying to scroll further, prevent default
    if ((isAtTop && scrollingUp) || (isAtBottom && scrollingDown)) {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onWheel={(e) => {
        // Prevent background scroll on backdrop
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-black rounded-xl shadow-2xl border border-blue-500/20 overflow-hidden animate-slideUp flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-500/20 px-5 py-3.5 flex-shrink-0">
          <h2 id="modal-title" className="text-xl font-bold text-white">
            {step === 4 ? 'Success!' : step === 5 ? 'Let\'s Talk!' : "Let's Talk"}
          </h2>
          <p className="text-blue-100 text-xs mt-1">
            {step === 1 && 'Verified by Google reCAPTCHA'}
            {step === 2 && 'Verify your identity'}
            {step === 3 && 'Tell us how we can help'}
            {step === 4 && 'We\'ll be in touch soon!'}
            {step === 5 && 'Start a voice conversation with our AI assistant'}
          </p>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Progress indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2 px-5 py-3 bg-black/50 border-b border-blue-500/10">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-10 bg-gradient-to-r from-blue-500 to-blue-600' : s < step ? 'w-6 bg-blue-500/60' : 'w-6 bg-gray-700'
                }`}
              />
            ))}
          </div>
        )}
        {step === 5 && (
          <div className="flex items-center justify-center gap-2 px-5 py-3 bg-black/50 border-b border-blue-500/10">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === 5 ? 'w-10 bg-gradient-to-r from-blue-500 to-blue-600' : 'w-6 bg-blue-500/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div 
          className="px-5 py-4 overflow-y-auto flex-1 min-h-0"
          onWheel={handleContentWheel}
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Step 1: Contact Info + CAPTCHA */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-200 mb-1.5">
                  Corporate Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500/50" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, email: value });
                      // Clear existing error and set an inline error if we detect a free provider
                      setErrors((prev) => ({ ...prev, email: undefined }));
                      if (value && isFreeEmailProvider(value)) {
                        setErrors((prev) => ({ ...prev, email: 'Please use your business email address. Personal email addresses are not accepted.' }));
                      }
                    }}
                    className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-blue-500/20'
                    } bg-black text-gray-100`}
                    placeholder="your.name@company.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-200 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500/50" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-blue-500/20'
                    } bg-black text-gray-100`}
                    placeholder="+1 (555) 000-0000"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* reCAPTCHA Badge Info */}
              <div className="flex items-start gap-2 px-3 py-2 bg-black/50 rounded-lg border border-blue-500/10">
                <Shield className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] leading-tight text-gray-400">
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Terms of Service
                  </a>{' '}
                  apply.
                </p>
              </div>

              {/* Privacy Policy & Terms Acceptance */}
              <div className="px-3 py-2 bg-black/50 rounded-lg border border-blue-500/10">
                <p className="text-[10px] leading-tight text-gray-400">
                  By continuing, you agree to our{' '}
                  <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !!errors.email}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <p className="text-center text-xs text-gray-400 mb-2">
                  We&apos;ve sent a 6-digit code to <strong className="text-gray-100">{formData.email}</strong>
                </p>
                <p className="text-center text-[10px] text-blue-400 mb-4">
                  Code will be verified automatically when entered
                </p>
                <OTPInput
                  value={formData.otp}
                  onChange={(value) => setFormData({ ...formData, otp: value })}
                  error={!!errors.otp}
                  disabled={isLoading}
                />
                {errors.otp && <p className="mt-3 text-sm text-red-500 text-center">{errors.otp}</p>}
                {isLoading && formData.otp.length === 6 && !errors.otp && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-blue-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Verifying automatically...</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="text-xs text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-xs text-blue-500 hover:text-blue-600 transition-colors font-medium disabled:opacity-50 cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: Objective Selection */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-4">
              <ObjectiveSelector
                selected={formData.objective}
                onChange={(objective) => setFormData({ ...formData, objective })}
              />
              {errors.objective && <p className="text-xs text-red-500 text-center">{errors.objective}</p>}

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border-2 border-blue-500/30 text-gray-300 text-sm font-semibold rounded-lg hover:bg-blue-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.objective}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm">Submit</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="py-6 text-center space-y-4 animate-fadeIn">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center animate-bounce-slow">
                    <CheckCircle className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100 mb-1.5">
                  Thank You!
                </h3>
                <p className="text-sm text-gray-400">
                  We&apos;ve received your information. Let&apos;s talk now!
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Voice Agent - ALWAYS SHOWN */}
          {step === 5 && (
            <div className="py-4 space-y-4 animate-fadeIn">
              {/* SalesCentri Logo - hide when call is active */}
              {!callTracking.isCallActive && (
                <div className="flex justify-center mb-4">
                  <Image
                    src="/saleslogo.webp"
                    alt="SalesCentri"
                    width={180}
                    height={50}
                    priority
                    className="object-contain"
                  />
                </div>
              )}

              {/* Start Call Button or Voice Widget */}
              {!callTracking.isCallActive ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-300">
                    Ready to speak with our AI assistant?
                  </p>
                  <button
                    onClick={handleStartCall}
                    disabled={isInitializingCall}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-base font-bold rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed border border-blue-600/30 cursor-pointer"
                  >
                    {isInitializingCall ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-5 h-5 group-hover:animate-pulse" />
                        <span>Talk now</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    disabled={isInitializingCall}
                    className="w-full px-6 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Skip for now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Voice Widget Container - Using specified structure for embedding */}
                  <div 
                    id="voice-agent-container" 
                    className="w-full h-[225px] rounded-[20px] overflow-hidden relative bg-gradient-to-br from-black/50 to-blue-900/20 border border-blue-500/30"
                    style={{ 
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {/* ElevenLabs widget will be injected here and replace this loading state */}
                    <div className="w-full h-full flex items-center justify-center text-center text-gray-400 text-sm">
                      <div>
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <p>Loading voice interface...</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <button
                    onClick={handleEndCall}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-base font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 border border-blue-500/30 hover:border-blue-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                    <span>Close</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
