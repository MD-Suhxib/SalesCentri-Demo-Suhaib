'use client';

import { 
  PresentationLayout,
  Slide,
  SlideTitle,
  BulletList,
  FeatureCard,
  VisualMockup,
  FlowDiagram
} from '../../../components/presentation';
import styles from '../presentation-dark.module.css';

export default function StartupJourneyPresentation() {
  const signupFlow = [
    {
      title: 'Registration',
      description: 'Email or mobile signup',
      icon: <span>📧</span>
    },
    {
      title: 'OTP Verification',
      description: 'Security verification',
      icon: <span>🔐</span>
    },
    {
      title: 'Profile Creation',
      description: 'Basic startup details',
      icon: <span>👤</span>
    }
  ];

  const slides = [
    // Slide 1: Signup Flow
    <Slide key="signup">
      <SlideTitle 
        subtitle="Simple and secure registration process for startups joining Sales Centri Marketplace"
        center
      >
        Startup Signup Flow
      </SlideTitle>
      
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="order-2 md:order-1">
          <FlowDiagram steps={signupFlow} direction="vertical" />
        </div>
        
        <div className="space-y-4 order-1 md:order-2">
          <VisualMockup 
            title="Signup Interface" 
            subtitle="Clean and intuitive registration form"
            height="h-32 sm:h-40"
          >
            <div className="p-8 w-full h-full flex flex-col justify-center">
              <div className="bg-white rounded-lg p-6 shadow-md space-y-4 max-w-md mx-auto w-full">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-blue-500 rounded text-white flex items-center justify-center">
                  Sign Up
                </div>
              </div>
            </div>
          </VisualMockup>
          
          <BulletList 
            items={[
              'Quick email or mobile number registration',
              'SMS/Email OTP verification for security',
              'Basic company information collection',
              'Terms & conditions acceptance'
            ]}
          />
        </div>
      </div>
    </Slide>,

    // Slide 2: Onboarding Journey
    <Slide key="onboarding">
      <SlideTitle 
        subtitle="Comprehensive startup profile setup to maximize marketplace visibility"
        center
      >
        Onboarding Journey
      </SlideTitle>
      
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon={<span>🏢</span>}
          title="Company Details"
          description="Business information, industry, location, and founding details"
          delay={0.1}
        />
        <FeatureCard
          icon={<span>📦</span>}
          title="Product/Service Listing"
          description="Detailed descriptions, features, pricing, and target market"
          delay={0.2}
        />
        <FeatureCard
          icon={<span>📊</span>}
          title="Traction & Metrics"
          description="Revenue data, user growth, key achievements, and milestones"
          delay={0.3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <VisualMockup title="Onboarding Progress" subtitle="Step-by-step completion tracking">
          <div className="p-6 w-full h-full flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm text-blue-600">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center"><span className="text-green-500 mr-2">✓</span> Company Details</div>
                <div className="flex items-center"><span className="text-green-500 mr-2">✓</span> Product Listing</div>
                <div className="flex items-center"><span className="text-yellow-500 mr-2">○</span> Team Details</div>
                <div className="flex items-center"><span className="text-gray-400 mr-2">○</span> Compliance Files</div>
              </div>
            </div>
          </div>
        </VisualMockup>

        <BulletList 
          items={[
            'Multi-step guided onboarding process',
            'Document upload for compliance verification',
            'Team member addition and role assignment',
            'Product showcase with multimedia support',
            'Financial data and traction metrics',
            'Industry categorization and tagging'
          ]}
        />
      </div>
    </Slide>,

    // Slide 3: Post-Onboarding Tracking
    <Slide key="tracking">
      <SlideTitle 
        subtitle="Continuous monitoring and optimization of your startup profile"
        center
      >
        Post-Onboarding Tracking
      </SlideTitle>
      
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div>
          <VisualMockup title="Profile Dashboard" subtitle="Real-time profile analytics" height="h-48 sm:h-56">
            <div className="p-6 w-full h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Profile Completion</span>
                  <span className="text-2xl font-bold text-green-600">87%</span>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <h4 className="font-medium text-sm mb-2">Pending Tasks</h4>
                  <div className="space-y-1 text-xs">
                    <div className="text-orange-600">Upload financial statements</div>
                    <div className="text-red-600">Add team member profiles</div>
                    <div className="text-blue-600">Update product pricing</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded p-3">
                  <h4 className="font-medium text-sm text-blue-800">AI Suggestions</h4>
                  <p className="text-xs text-blue-600">Add customer testimonials to boost credibility</p>
                </div>
              </div>
            </div>
          </VisualMockup>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard
              icon={<span>%</span>}
              title="Completion Score"
              description="Real-time profile completeness percentage"
              delay={0.1}
            />
            <FeatureCard
              icon={<span>📋</span>}
              title="Task Management"
              description="Prioritized list of pending actions"
              delay={0.2}
            />
            <FeatureCard
              icon={<span>🤖</span>}
              title="AI Recommendations"
              description="Smart suggestions to improve visibility"
              delay={0.3}
            />
            <FeatureCard
              icon={<span>📈</span>}
              title="Visibility Metrics"
              description="Track profile views and engagement"
              delay={0.4}
            />
          </div>

          <BulletList 
            items={[
              'Dynamic completion percentage tracking',
              'Prioritized task queue for optimization',
              'AI-powered profile enhancement suggestions',
              'Real-time visibility score monitoring'
            ]}
          />
        </div>
      </div>
    </Slide>,

    // Slide 4: Go-Live Dashboard
    <Slide key="golive">
      <SlideTitle 
        subtitle="Active marketplace participation with lead bidding and real-time opportunities"
        center
      >
        Go-Live Dashboard
      </SlideTitle>
      
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <VisualMockup title="Lead Bidding Interface" subtitle="Real-time opportunity marketplace" height="h-40 sm:h-48">
            <div className="p-6 w-full h-full">
              <div className="space-y-4">
                <div className="bg-white rounded border p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">Enterprise CRM Solution</h4>
                      <p className="text-xs text-gray-600">Budget: $50K - $100K</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Live</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">Posted 2 hours ago • 8 bids</div>
                  <div className="flex space-x-2">
                    <input className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Bid amount" />
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">Bid</button>
                  </div>
                </div>
                
                <div className="bg-white rounded border p-4 opacity-75">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">Mobile App Development</h4>
                      <p className="text-xs text-gray-600">Budget: $25K - $50K</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Ending Soon</span>
                  </div>
                  <div className="text-xs text-gray-500">Posted 1 day ago • 15 bids</div>
                </div>
              </div>
            </div>
          </VisualMockup>

          <div className="space-y-4">
            <VisualMockup title="Visibility Score" subtitle="Profile performance metrics" height="h-24 sm:h-28">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8.7</div>
                  <div className="text-sm text-gray-600">Visibility Score</div>
                  <div className="text-xs text-green-600">↑ +1.2 this week</div>
                </div>
              </div>
            </VisualMockup>

            <BulletList 
              items={[
                'Real-time lead notifications and alerts',
                'Smart bid recommendations based on profile',
                'Competitive analysis and market insights',
                'Automated lead matching algorithms',
                'Win probability indicators',
                'Portfolio showcase integration'
              ]}
            />
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 5: Historical View
    <Slide key="history">
      <SlideTitle 
        subtitle="Comprehensive analytics and performance tracking for data-driven growth"
        center
      >
        Historical View & Analytics
      </SlideTitle>
      
      <div className="grid lg:grid-cols-2 gap-12">
        <VisualMockup title="Growth Analytics Dashboard" subtitle="Comprehensive performance metrics">
          <div className="p-6 w-full h-full">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-lg font-bold text-blue-600">127</div>
                  <div className="text-xs text-gray-600">Total Leads</div>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <div className="text-lg font-bold text-green-600">23</div>
                  <div className="text-xs text-gray-600">Closed Deals</div>
                </div>
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-lg font-bold text-blue-600">18%</div>
                  <div className="text-xs text-gray-600">Win Rate</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <h4 className="text-sm font-medium mb-2 text-gray-800">Recent Activity</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Enterprise CRM Deal</span>
                    <span className="text-green-600 font-medium">Won</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Mobile App Project</span>
                    <span className="text-blue-600 font-medium">In Progress</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">E-commerce Platform</span>
                    <span className="text-red-600 font-medium">Lost</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VisualMockup>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <FeatureCard
              icon={<span>📊</span>}
              title="Lead Analytics"
              description="Track all past opportunities and outcomes"
              delay={0.1}
            />
            <FeatureCard
              icon={<span>💰</span>}
              title="Revenue Tracking"
              description="Monitor closed deals and revenue growth"
              delay={0.2}
            />
            <FeatureCard
              icon={<span>🤝</span>}
              title="Investor Relations"
              description="Manage investor communications and updates"
              delay={0.3}
            />
            <FeatureCard
              icon={<span>📈</span>}
              title="Growth Insights"
              description="Data-driven recommendations for scaling"
              delay={0.4}
            />
          </div>

          <BulletList 
            items={[
              'Complete lead and deal history tracking',
              'Revenue and growth analytics dashboard',
              'Investor interaction timeline and updates',
              'Performance benchmarking against industry',
              'Predictive analytics for future opportunities',
              'Custom reporting and data export features'
            ]}
          />
        </div>
      </div>
    </Slide>,

    // Slide 6: Payment Gateway & Invoicing
    <Slide key="payment">
      <SlideTitle 
        subtitle="Seamless payment processing with integrated invoicing and compliance features"
        center
      >
        Payment Gateway & Invoicing
      </SlideTitle>
      
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <VisualMockup title="Wallet Dashboard" subtitle="Credit management and recharge system">
            <div className="p-6 w-full h-full flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">₹12,450</div>
                    <div className="text-sm text-gray-600">Available Credits</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3">
                    <h4 className="font-medium text-sm mb-2 text-gray-800">Recent Transactions</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Lead Bid - CRM Project</span>
                        <span className="text-red-600">-₹500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Wallet Recharge</span>
                        <span className="text-green-600">+₹5,000</span>
                      </div>
                    </div>
                  </div>                <button className="w-full bg-blue-500 text-white py-2 rounded text-sm">
                  Recharge Wallet
                </button>
              </div>
            </div>
          </VisualMockup>

          <VisualMockup title="Invoice Generator" subtitle="GST-compliant automated invoicing" height="h-48">
            <div className="p-4 w-full h-full flex flex-col justify-center">
              <div className="bg-white rounded border p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Invoice #INV-2024-001</span>
                  <span>Date: 26/11/2024</span>
                </div>
                <div className="border-t pt-2 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Lead Bidding Credits</span>
                    <span>₹5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹900</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Total</span>
                    <span>₹5,900</span>
                  </div>
                </div>
              </div>
            </div>
          </VisualMockup>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <FeatureCard
              icon={<span>💳</span>}
              title="Multiple Payment Methods"
              description="Support for cards, UPI, net banking, and digital wallets"
              delay={0.1}
            />
            <FeatureCard
              icon={<span>🔐</span>}
              title="Secure Transactions"
              description="PCI DSS compliant payment processing with encryption"
              delay={0.2}
            />
            <FeatureCard
              icon={<span>📄</span>}
              title="GST Compliance"
              description="Automated GST calculation and compliant invoice generation"
              delay={0.3}
            />
            <FeatureCard
              icon={<span>📊</span>}
              title="Credit Management"
              description="Real-time credit tracking and automated deductions"
              delay={0.4}
            />
          </div>

          <BulletList 
            items={[
              'Prepaid wallet system for bidding credits',
              'Automated credit deduction for successful bids',
              'Real-time transaction history and statements',
              'GST-compliant PDF invoice generation',
              'Multiple payment gateway integration',
              'Refund and dispute management system'
            ]}
          />
        </div>
      </div>
    </Slide>
  ];

  return (
    <div className={`dark bg-slate-900 ${styles.darkModeForce}`}>
      <PresentationLayout title="Startup Journey - Sales Centri Marketplace">
        {slides}
      </PresentationLayout>
    </div>
  );
}