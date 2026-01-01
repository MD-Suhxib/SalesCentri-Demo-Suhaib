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

export default function SupplierJourneyPresentation() {
  const signupFlow = [
    {
      title: 'Business Registration',
      description: 'Company details and credentials',
      icon: <span>🏢</span>
    },
    {
      title: 'OTP Verification',
      description: 'Email/SMS security check',
      icon: <span>🔐</span>
    },
    {
      title: 'Profile Setup',
      description: 'Services and capabilities',
      icon: <span>⚙️</span>
    }
  ];

  const slides = [
    // Slide 1: Signup Flow
    <Slide key="signup" className="bg-gradient-to-br from-blue-900/20 to-blue-800/20">
      <SlideTitle 
        subtitle="Streamlined registration process for service providers and solution suppliers"
        center
      >
        Supplier Signup Flow
      </SlideTitle>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <FlowDiagram steps={signupFlow} direction="vertical" />
        </div>
        
        <div className="space-y-6">
          <VisualMockup 
            title="Supplier Registration Portal" 
            subtitle="Professional onboarding experience"
          >
            <div className="p-8 w-full h-full flex flex-col justify-center">
              <div className="bg-white rounded-lg p-6 shadow-md space-y-4 max-w-md mx-auto w-full">
                <div className="text-center mb-4">
                  <div className="text-green-600 font-bold">Join as Supplier</div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 bg-green-600 rounded text-white flex items-center justify-center">
                  Register & Verify
                </div>
              </div>
            </div>
          </VisualMockup>
          
          <BulletList 
            items={[
              'Business license and registration verification',
              'Multi-channel OTP verification (SMS/Email)',
              'Industry category and specialization selection',
              'Basic company profile and contact setup',
              'Terms acceptance and compliance check'
            ]}
          />
        </div>
      </div>
    </Slide>,

    // Slide 2: Onboarding Journey
    <Slide key="onboarding" className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800/20 dark:to-blue-700/20">
      <SlideTitle 
        subtitle="Comprehensive supplier profile creation to showcase capabilities and build trust"
        center
      >
        Supplier Onboarding Journey
      </SlideTitle>
      
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon={<span>🔧</span>}
          title="Services Portfolio"
          description="Detailed service catalog, expertise areas, and solution offerings"
          delay={0.1}
        />
        <FeatureCard
          icon={<span>💰</span>}
          title="Pricing Models"
          description="Flexible pricing structures, rate cards, and cost methodologies"
          delay={0.2}
        />
        <FeatureCard
          icon={<span>📄</span>}
          title="Compliance Files"
          description="Certifications, licenses, insurance, and quality standards"
          delay={0.3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <VisualMockup title="Portfolio Builder" subtitle="Showcase capabilities and case studies">
          <div className="p-6 w-full h-full flex flex-col justify-center">
            <div className="space-y-4">
              <div className="bg-green-50 rounded p-3">
                <h4 className="font-medium text-sm mb-2">Service Categories</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Web Development</span>
                    <span className="text-green-600">✓ Expert</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Apps</span>
                    <span className="text-blue-600">✓ Advanced</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cloud Solutions</span>
                    <span className="text-green-600">✓ Expert</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded p-3">
                <h4 className="font-medium text-sm mb-2">Case Studies</h4>
                <div className="text-xs space-y-1">
                  <div>• E-commerce Platform (₹25L project)</div>
                  <div>• Banking Mobile App (₹18L project)</div>
                  <div>• Healthcare System (₹35L project)</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <h4 className="font-medium text-sm mb-2">Certifications</h4>
                <div className="flex space-x-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">ISO 9001</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">CMMI L3</span>
                </div>
              </div>
            </div>
          </div>
        </VisualMockup>

        <BulletList 
          items={[
            'Comprehensive service catalog with detailed descriptions',
            'Portfolio showcase with client case studies',
            'Flexible pricing models and rate structures',
            'Team profiles and technical expertise display',
            'Compliance documentation and certifications',
            'Client testimonials and reference uploads'
          ]}
        />
      </div>
    </Slide>,

    // Slide 3: Post-Onboarding Tracking
    <Slide key="tracking" className="bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700/20 dark:to-blue-600/20">
      <SlideTitle 
        subtitle="Continuous profile optimization and quality enhancement for maximum visibility"
        center
      >
        Post-Onboarding Tracking
      </SlideTitle>
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <VisualMockup title="Quality Dashboard" subtitle="Profile optimization and performance tracking">
            <div className="p-6 w-full h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-gray-600">Profile Completeness</div>
                  <div className="text-xs text-green-600">↑ +8% this week</div>
                </div>
                
                <div className="bg-orange-50 rounded p-3">
                  <h4 className="font-medium text-sm mb-2">Quality Score</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">8.7</span>
                    <div className="text-xs text-right">
                      <div>Industry Average: 7.2</div>
                      <div className="text-orange-600">Above Average</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded p-3">
                  <h4 className="font-medium text-sm text-blue-800 mb-2">AI Suggestions</h4>
                  <div className="text-xs text-blue-600 space-y-1">
                    <div>• Add more project screenshots</div>
                    <div>• Update recent client testimonials</div>
                    <div>• Include team size details</div>
                  </div>
                </div>
              </div>
            </div>
          </VisualMockup>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <FeatureCard
              icon={<span>⭐</span>}
              title="Quality Score"
              description="AI-powered profile quality assessment"
              delay={0.1}
            />
            <FeatureCard
              icon={<span>📊</span>}
              title="Market Visibility"
              description="Track profile views and inquiry generation"
              delay={0.2}
            />
            <FeatureCard
              icon={<span>🎯</span>}
              title="Match Rate"
              description="Algorithm optimization for better lead matching"
              delay={0.3}
            />
            <FeatureCard
              icon={<span>📈</span>}
              title="Performance Analytics"
              description="Detailed insights and improvement recommendations"
              delay={0.4}
            />
          </div>

          <BulletList 
            items={[
              'Real-time profile completeness monitoring',
              'AI-driven quality score with industry benchmarks',
              'Smart recommendations for visibility improvement',
              'Market positioning and competitive analysis',
              'Lead matching optimization suggestions'
            ]}
          />
        </div>
      </div>
    </Slide>,

    // Slide 4: Go-Live Dashboard & Lead Bidding
    <Slide key="golive" className="bg-gradient-to-br from-indigo-100 to-blue-150 dark:from-indigo-800/20 dark:to-blue-700/20">
      <SlideTitle 
        subtitle="Active marketplace participation with intelligent lead bidding and opportunity management"
        center
      >
        Go-Live Dashboard & Lead Bidding
      </SlideTitle>
      
      <div className="space-y-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <VisualMockup title="Lead Marketplace" subtitle="Real-time opportunity bidding system">
            <div className="p-6 w-full h-full">
              <div className="space-y-4">
                <div className="bg-white rounded border p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-sm">E-commerce Platform Development</h4>
                      <p className="text-xs text-gray-600">Budget: ₹15-25 Lakhs • Timeline: 6 months</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">95% Match</span>
                      <div className="text-xs text-gray-500 mt-1">Win Prob: 78%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">React</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Node.js</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">MongoDB</span>
                  </div>
                  <div className="flex space-x-2">
                    <input className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Bid credits: 250" />
                    <button className="bg-green-600 text-white px-4 py-1 rounded text-xs">Place Bid</button>
                  </div>
                </div>
                
                <div className="bg-white rounded border p-4 shadow-sm opacity-75">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">CRM System Integration</h4>
                      <p className="text-xs text-gray-600">Budget: ₹8-12 Lakhs • Timeline: 4 months</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">72% Match</span>
                      <div className="text-xs text-gray-500 mt-1">Win Prob: 45%</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">12 suppliers already bidding</div>
                </div>
              </div>
            </div>
          </VisualMockup>

          <div className="space-y-6">
            <VisualMockup title="Bidding Intelligence" subtitle="Smart recommendations and analytics" height="h-64">
              <div className="p-4 w-full h-full flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="bg-green-50 rounded p-3">
                    <h4 className="font-medium text-sm mb-2 text-green-800">Recommended Bid</h4>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">250 Credits</div>
                      <div className="text-xs text-green-700">Based on project match & competition</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded p-3">
                    <h4 className="font-medium text-sm mb-2">Lead Allocation Logic</h4>
                    <div className="text-xs space-y-1">
                      <div>• Profile Match Score (40%)</div>
                      <div>• Bid Amount (30%)</div>
                      <div>• Response Speed (20%)</div>
                      <div>• Past Performance (10%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </VisualMockup>

            <BulletList 
              items={[
                'AI-powered lead matching and recommendations',
                'Smart bid amount suggestions based on competition',
                'Real-time win probability calculations',
                'Automated lead filtering by expertise and capacity',
                'Instant notifications for high-match opportunities',
                'Portfolio showcase during bid evaluation'
              ]}
            />
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 5: Historical View
    <Slide key="history" className="bg-gradient-to-br from-slate-800/20 to-blue-800/20">
      <SlideTitle 
        subtitle="Comprehensive business analytics and performance insights for strategic growth"
        center
      >
        Historical Performance & Analytics
      </SlideTitle>
      
      <div className="grid lg:grid-cols-2 gap-12">
        <VisualMockup title="Business Dashboard" subtitle="Revenue tracking and client management">
          <div className="p-6 w-full h-full">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-lg font-bold text-blue-600">156</div>
                  <div className="text-xs text-gray-600">Leads Won</div>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <div className="text-lg font-bold text-green-600">₹2.8Cr</div>
                  <div className="text-xs text-gray-600">Total Revenue</div>
                </div>
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-lg font-bold text-blue-600">23%</div>
                  <div className="text-xs text-gray-600">Win Rate</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <h4 className="text-sm font-medium mb-2">Recent Projects</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>E-commerce Platform</span>
                    <span className="text-green-600">₹22L • Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Banking Mobile App</span>
                    <span className="text-blue-600">₹18L • In Progress</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CRM Integration</span>
                    <span className="text-orange-600">₹12L • Under Review</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded p-3">
                <h4 className="text-sm font-medium mb-1 text-orange-800">Growth Trend</h4>
                <div className="text-xs text-orange-700">Revenue up 45% vs last quarter</div>
              </div>
            </div>
          </div>
        </VisualMockup>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <FeatureCard
              icon={<span>📈</span>}
              title="Revenue Analytics"
              description="Track project revenue and growth patterns"
              delay={0.1}
            />
            <FeatureCard
              icon={<span>🤝</span>}
              title="Client Relationships"
              description="Manage ongoing and past client interactions"
              delay={0.2}
            />
            <FeatureCard
              icon={<span>📊</span>}
              title="Performance Metrics"
              description="Analyze proposal success and market positioning"
              delay={0.3}
            />
            <FeatureCard
              icon={<span>🎯</span>}
              title="Market Intelligence"
              description="Industry trends and competitive insights"
              delay={0.4}
            />
          </div>

          <BulletList 
            items={[
              'Complete project and revenue history tracking',
              'Client relationship management and communication logs',
              'Detailed proposal performance and win/loss analysis',
              'Market trend analysis and opportunity identification',
              'Competitive benchmarking and positioning insights',
              'Custom reports and business intelligence dashboards'
            ]}
          />
        </div>
      </div>
    </Slide>,

    // Slide 6: Payment Gateway & Invoicing
    <Slide key="payment" className="bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-800/20 dark:to-blue-700/20">
      <SlideTitle 
        subtitle="Comprehensive financial management with automated billing and tax compliance"
        center
      >
        Payment Gateway & Invoicing
      </SlideTitle>
      
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <VisualMockup title="Credit Wallet System" subtitle="Flexible credit management and recharge">
            <div className="p-6 w-full h-full flex flex-col justify-center">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,850 Credits</div>
                  <div className="text-sm text-gray-600">Available for bidding</div>
                  <div className="text-xs text-orange-500 mt-1">Low balance - Recharge recommended</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-blue-100 text-blue-800 p-2 rounded text-center">
                    <div className="font-bold">500</div>
                    <div>₹2,500</div>
                  </div>
                  <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                    <div className="font-bold">1000</div>
                    <div>₹4,500</div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 p-2 rounded text-center">
                    <div className="font-bold">2500</div>
                    <div>₹10,000</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-sm mb-2 text-gray-800">Recent Activity</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-700">E-commerce Lead Bid</span>
                      <span className="text-red-600">-250 credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Wallet Recharge</span>
                      <span className="text-green-600">+1000 credits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </VisualMockup>

          <VisualMockup title="GST Invoice System" subtitle="Automated tax-compliant invoicing" height="h-64">
            <div className="p-4 w-full h-full flex flex-col justify-center">
              <div className="bg-white rounded border p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <div>
                    <div className="font-medium text-gray-800">TechSolutions Pvt Ltd</div>
                    <div className="text-gray-600">GSTIN: 29ABCDE1234F1Z5</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">INV-2024-078</div>
                    <div className="text-gray-600">Date: 26/11/2024</div>
                  </div>
                </div>
                <div className="border-t pt-2 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Credit Pack - 1000 credits</span>
                    <span className="text-gray-800">₹4,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">CGST (9%)</span>
                    <span className="text-gray-800">₹405</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">SGST (9%)</span>
                    <span className="text-gray-800">₹405</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span className="text-gray-800">Total Amount</span>
                    <span className="text-gray-800">₹5,310</span>
                  </div>
                </div>
                <button className="w-full bg-blue-500 text-white py-1 rounded text-xs">
                  Download PDF
                </button>
              </div>
            </div>
          </VisualMockup>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <FeatureCard
              icon={<span>🎯</span>}
              title="Credit-Based System"
              description="Flexible bidding credits for lead acquisition"
              delay={0.1}
            />
            <FeatureCard
              icon={<span>⚡</span>}
              title="Instant Recharge"
              description="Quick wallet top-up with multiple payment options"
              delay={0.2}
            />
            <FeatureCard
              icon={<span>📊</span>}
              title="Usage Analytics"
              description="Track credit consumption and ROI on investments"
              delay={0.3}
            />
            <FeatureCard
              icon={<span>🧾</span>}
              title="Tax Compliance"
              description="Automated GST calculations and compliant invoicing"
              delay={0.4}
            />
          </div>

          <BulletList 
            items={[
              'Flexible credit packs for different budget requirements',
              'Real-time credit deduction for successful bid placements',
              'Comprehensive transaction history and audit trails',
              'GST-compliant automated invoice generation',
              'Multiple payment gateways and methods support',
              'Refund management and dispute resolution system'
            ]}
          />
        </div>
      </div>
    </Slide>
  ];

  return (
    <div className={`dark bg-slate-900 ${styles.darkModeForce}`}>
      <PresentationLayout title="Supplier Journey - Sales Centri Marketplace">
        {slides}
      </PresentationLayout>
    </div>
  );
}