/**
 * Mock Responses for External APIs
 * Used for network interception in tests
 */

export const mockResponses = {
  // OpenAI API mock response
  openai: {
    success: {
      id: 'chatcmpl-test-12345',
      object: 'chat.completion',
      created: Date.now(),
      model: 'gpt-4o',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'This is a mock response from OpenAI GPT-4o for testing purposes.'
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30
      }
    },
    error: {
      error: {
        message: 'API rate limit exceeded',
        type: 'rate_limit_error',
        code: 'rate_limit_exceeded'
      }
    }
  },

  // Anthropic Claude API mock response
  anthropic: {
    success: {
      id: 'msg-test-67890',
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: 'This is a mock response from Anthropic Claude for testing purposes.'
        }
      ],
      model: 'claude-3-5-sonnet-20241022',
      stop_reason: 'end_turn',
      usage: {
        input_tokens: 10,
        output_tokens: 15
      }
    }
  },

  // Google Gemini API mock response
  gemini: {
    success: {
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'This is a mock response from Google Gemini for testing purposes.'
              }
            ],
            role: 'model'
          },
          finishReason: 'STOP',
          safetyRatings: []
        }
      ]
    }
  },

  // PayPal API mock response
  paypal: {
    createOrder: {
      orderId: 'MOCK-PAYPAL-ORDER-12345',
      approveUrl: 'https://sandbox.paypal.com/checkoutnow?token=MOCK-TOKEN-12345',
      status: 'CREATED'
    },
    captureOrder: {
      orderId: 'MOCK-PAYPAL-ORDER-12345',
      status: 'COMPLETED',
      payer: {
        email_address: 'test@example.com',
        payer_id: 'MOCK-PAYER-ID'
      },
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '299.00'
          }
        }
      ]
    }
  },

  // Stripe API mock response
  stripe: {
    createSession: {
      url: 'https://checkout.stripe.com/c/pay/cs_test_mock12345',
      sessionId: 'cs_test_mock12345',
      id: 'cs_test_mock12345'
    },
    createSessionError: {
      error: 'Stripe client initialization failed'
    },
    sessionExpired: {
      error: 'This checkout session has expired'
    },
    // Test card numbers for Stripe test mode
    testCards: {
      success: '4242424242424242',
      declined: '4000000000000002',
      insufficientFunds: '4000000000009995',
      requiresAuth: '4000002500003155',
      expiredCard: '4000000000000069',
      processingError: '4000000000000119'
    }
  },

  // PayU API mock response
  payu: {
    createSession: {
      status: 'SUCCESS',
      result: {
        sessionId: 'MOCK-PAYU-SESSION-12345',
        paymentUrl: 'https://test.payu.in/payment?sessionId=MOCK-PAYU-SESSION-12345'
      }
    }
  },

  // External Auth API mock response
  auth: {
    profile: {
      success: true,
      profile: {
        email: 'test@salescentri.com',
        name: 'Test User',
        uid: 'test-user-id-12345',
        role: 'user'
      }
    },
    loginRedirect: {
      redirectUrl: 'https://dashboard.salescentri.com/login?redirect=http://localhost:3000'
    }
  },

  // Pricing API mock response
  pricing: {
    success: {
      data: [
        {
          segment: 'Business',
          billingCycle: 'Yearly',
          planName: 'Premium',
          price: 299,
          features: ['Unlimited users', 'Advanced analytics']
        },
        {
          segment: 'Personal',
          billingCycle: 'Monthly',
          planName: 'Basic',
          price: 9,
          features: ['5 users', 'Basic analytics']
        }
      ]
    }
  },

  // OTP API mock responses
  otp: {
    sendSuccess: {
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 180 // 3 minutes
    },
    sendRateLimit: {
      success: false,
      message: 'Rate limit exceeded. Please try again in 15 minutes.',
      remainingTime: 900
    },
    verifySuccess: {
      success: true,
      message: 'OTP verified successfully'
    },
    verifyExpired: {
      success: false,
      message: 'OTP has expired. Please request a new one.'
    },
    verifyInvalid: {
      success: false,
      message: 'Invalid OTP. Please try again.',
      attemptsRemaining: 2
    },
    verifyMaxAttempts: {
      success: false,
      message: 'Maximum verification attempts exceeded. Please request a new OTP.'
    }
  },

  // Streaming research mock chunks
  streaming: {
    researchChunks: [
      { type: 'sources', data: [{ url: 'https://example.com', title: 'Test Source 1' }] },
      { type: 'chunk', data: 'This is the first chunk of research data.' },
      { type: 'chunk', data: ' This is the second chunk continuing the analysis.' },
      { type: 'chunk', data: ' Final chunk with conclusions.' },
      { type: 'complete', message: 'Research completed successfully' }
    ]
  }
};

export default mockResponses;
