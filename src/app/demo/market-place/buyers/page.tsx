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

export default function BuyerJourneyPresentation() {
  const signupFlow = [
    {
      title: 'Business Email',
      description: 'Corporate email registration',
      icon: <span>🏢</span>
    },
    {
      title: 'Role Selection',
      description: 'Procurement/CXO/Manager',
      icon: <span>👔</span>
    },
    {
      title: 'Company Verification',
      description: 'Business credentials check',
      icon: <span>✅</span>
    }
  ];

  const slides = [
    // Slide 1: Signup Flow
    <Slide key="signup" className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20">
      <SlideTitle 
        subtitle="Professional registration process designed for corporate buyers and procurement teams"
        center
      >
        Buyer Signup Flow
      </SlideTitle>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <FlowDiagram steps={signupFlow} direction="vertical" />
        </div>
        
        <div className="space-y-6">
          <VisualMockup 
            title="Corporate Registration" 
            subtitle="Enterprise-grade signup experience"
          >
            <div className="p-8 w-full h-full flex flex-col justify-center">
              <div className="bg-white rounded-lg p-6 shadow-md space-y-4 max-w-md mx-auto w-full">
                <div className="text-center mb-4">
                  <div className="text-blue-600 font-bold">Corporate Account</div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 bg-blue-100 rounded text-center flex items-center justify-center text-xs">CXO</div>
                  <div className="h-10 bg-gray-200 rounded text-center flex items-center justify-center text-xs">Proc.</div>
                  <div className="h-10 bg-gray-200 rounded text-center flex items-center justify-center text-xs">Mgr.</div>
                </div>
                <div className="h-10 bg-blue-600 rounded text-white flex items-center justify-center">
                  Verify & Continue
                </div>
              </div>
            </div>
          </VisualMockup>
          
          <BulletList 
            items={[
              'Business email domain verification',
              'Role-based access and permissions',
              'Company authenticity validation',
              'Industry and size categorization',
              'Compliance and security checks'
            ]}
          />
        </div>
      </div>
    </Slide>,

    // Slide 2: Onboarding Journey
    <Slide key="onboarding" className="bg-gradient-to-br from-slate-900/20 to-gray-900/20">
      <SlideTitle 
        subtitle="Comprehensive procurement setup to streamline supplier discovery and evaluation"
        center
      >
        Buyer Onboarding Journey
      </SlideTitle>
      
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon={<span>📋</span>}
          title="Requirements Setup"
          description="Define procurement needs, specifications, and project scope"
          delay={0.1}
        />
        <FeatureCard
          icon={<span>⚖️</span>}
          title="Evaluation Criteria"
          description="Set scoring parameters, quality standards, and decision factors"
          delay={0.2}
        />
        <FeatureCard
          icon={<span>👥</span>}
          title="Team Configuration"
          description="Add team members, assign roles, and setup approval workflows"
          delay={0.3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <VisualMockup title="Procurement Preferences" subtitle="Customized buying process setup">
          <div className="p-6 w-full h-full flex flex-col justify-center">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded p-3">
                <h4 className="font-medium text-sm mb-2 text-blue-800">Budget Preferences</h4>
                <div className="text-xs space-y-1 text-blue-700">
                  <div>• Annual IT Budget: $500K - $1M</div>
                  <div>• Project Range: $10K - $100K</div>
                  <div>• Payment Terms: Net 30</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <h4 className="font-medium text-sm mb-2 text-gray-800">Vendor Requirements</h4>
                <div className="text-xs space-y-1 text-gray-700">
                  <div>✓ ISO 27001 Certified</div>
                  <div>✓ 3+ Years Experience</div>
                  <div>✓ Local Support Available</div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded p-3">
                <h4 className="font-medium text-sm mb-2 text-green-800">Evaluation Matrix</h4>
                <div className="text-xs text-green-700">Price (30%) • Quality (40%) • Timeline (20%) • Support (10%)</div>
              </div>
            </div>
          </div>
        </VisualMockup>

        <BulletList 
          items={[
            'Industry-specific requirement templates',
            'Custom evaluation scorecards and criteria',
            'Multi-level approval workflow setup',
            'Vendor qualification parameters',
            'Budget allocation and approval limits',
            'Compliance and regulatory requirements'
          ]}
        />
      </div>
    </Slide>,

    // Slide 3: Post-Onboarding Tracking
    <Slide key="tracking" className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20">
      <SlideTitle 
        subtitle="Real-time monitoring of procurement activities and supplier engagement"
        center
      >
        Post-Onboarding Tracking
      </SlideTitle>
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <VisualMockup title="Procurement Dashboard" subtitle="Live requirement and supplier tracking">
            <div className="p-6 w-full h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="bg-blue-50 rounded p-3">
                  <h4 className="font-medium text-sm mb-2 text-gray-800">Active Requirements</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-700">CRM Implementation</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Live</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Cloud Migration</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">Draft</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="font-medium text-sm mb-2 text-gray-800">Supplier Activity</h4>
                  <div className="text-xs space-y-1">
                    <div className="text-gray-700">23 suppliers submitted proposals</div>
                    <div className="text-gray-700">8 shortlisted for evaluation</div>
                    <div className="text-gray-700">3 scheduled for presentations</div>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded p-3">
                  <h4 className="font-medium text-sm text-orange-800">Pending Actions</h4>
                  <div className="text-xs text-orange-600">Review and rank 5 new proposals</div>
                </div>
              </div>
            </div>
          </VisualMockup>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <FeatureCard
              icon={<span>📊</span>}
              title="Requirement Status"
              description="Track all active and past procurement projects"
              delay={0.1}
            />
            <FeatureCard
              icon={<span>📥</span>}
              title="Proposal Management"
              description="Organize and evaluate supplier submissions"
              delay={0.2}
            />
            <FeatureCard
              icon={<span>⚡</span>}
              title="Smart Notifications"
              description="Automated alerts for key milestones"
              delay={0.3}
            />
            <FeatureCard
              icon={<span>🎯</span>}
              title="Vendor Matching"
              description="AI-powered supplier recommendations"
              delay={0.4}
            />
          </div>

          <BulletList 
            items={[
              'Real-time requirement broadcasting status',
              'Supplier response and engagement metrics',
              'Automated comparison and ranking triggers',
              'Deadline and milestone tracking alerts',
              'Budget utilization and approval status'
            ]}
          />
        </div>
      </div>
    </Slide>,

    // Slide 4: Go-Live Dashboard
    <Slide key="golive" className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
      <SlideTitle 
        subtitle="Active procurement management with AI-assisted supplier evaluation and real-time bidding"
        center
      >
        Go-Live Dashboard & Marketplace
      </SlideTitle>
      
      <div className="space-y-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <VisualMockup title="Supplier Marketplace" subtitle="Real-time proposal evaluation system">
            <div className="p-6 w-full h-full">
              <div className="space-y-4">
                <div className="bg-white rounded border p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">TechCorp Solutions</h4>
                      <p className="text-xs text-gray-600">CRM Implementation Proposal</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">$87,500</div>
                      <div className="text-xs text-gray-500">AI Score: 8.9/10</div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">ISO Certified</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Local Support</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-xs">Shortlist</button>
                    <button className="flex-1 border border-gray-300 px-3 py-1 rounded text-xs">View Details</button>
                  </div>
                </div>
                
                <div className="bg-white rounded border p-4 opacity-75">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">InnovateSoft Ltd</h4>
                      <p className="text-xs text-gray-600">CRM Implementation Proposal</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-orange-600">$95,000</div>
                      <div className="text-xs text-gray-500">AI Score: 7.2/10</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Under Review</div>
                </div>
              </div>
            </div>
          </VisualMockup>

          <div className="space-y-6">
            <VisualMockup title="AI Ranking Assistant" subtitle="Intelligent proposal scoring" height="h-48">
              <div className="p-4 w-full h-full flex flex-col justify-center">
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">AI Analysis</div>
                    <div className="text-sm text-gray-600">23 Proposals Evaluated</div>
                  </div>
                  
                  <div className="bg-green-50 rounded p-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Best Value Match</span>
                      <span className="font-bold">TechCorp Solutions</span>
                    </div>
                    <div className="text-xs text-green-700">Optimal price-quality ratio based on your criteria</div>
                  </div>
                </div>
              </div>
            </VisualMockup>

            <BulletList 
              items={[
                'Broadcast requirements to qualified suppliers',
                'Real-time proposal tracking and notifications',
                'AI-powered supplier ranking and matching',
                'Automated compliance and qualification checks',
                'Interactive vendor comparison matrices',
                'Collaborative evaluation with team members'
              ]}
            />
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 5: Historical View
    <Slide key="history" className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
      <SlideTitle 
        subtitle="Comprehensive procurement analytics and supplier performance insights"
        center
      >
        Historical Analytics & Insights
      </SlideTitle>
      
      <div className="grid lg:grid-cols-2 gap-12">
        <VisualMockup title="Procurement Analytics" subtitle="Performance and spend analysis">
          <div className="p-6 w-full h-full">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-lg font-bold text-blue-600">45</div>
                  <div className="text-xs text-gray-700 font-medium">RFPs Issued</div>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <div className="text-lg font-bold text-green-600">$2.8M</div>
                  <div className="text-xs text-gray-700 font-medium">Total Spend</div>
                </div>
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-lg font-bold text-blue-600">15%</div>
                  <div className="text-xs text-gray-700 font-medium">Cost Savings</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <h4 className="text-sm font-medium mb-2 text-gray-800">Top Performing Suppliers</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-700">TechCorp Solutions</span>
                    <span className="text-green-600 font-medium">9.2/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">InnovateSoft Ltd</span>
                    <span className="text-blue-600 font-medium">8.8/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">GlobalTech Inc</span>
                    <span className="text-blue-600 font-medium">8.5/10</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded p-3">
                <h4 className="text-sm font-medium mb-1 text-orange-800">Budget Utilization</h4>
                <div className="flex items-center">
                  <div className="flex-1 bg-orange-200 rounded-full h-2 mr-2">
                    <div className="bg-orange-600 h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-xs">75%</span>
                </div>
              </div>
            </div>
          </div>
        </VisualMockup>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <FeatureCard
              icon={<span>📋</span>}
              title="RFP/RFI Archive"
              description="Complete history of all procurement activities"
              delay={0.1}
            />
            <FeatureCard
              icon={<span>⭐</span>}
              title="Supplier Ratings"
              description="Performance tracking and quality assessments"
              delay={0.2}
            />
            <FeatureCard
              icon={<span>💰</span>}
              title="Spend Analytics"
              description="Budget tracking and cost optimization insights"
              delay={0.3}
            />
            <FeatureCard
              icon={<span>📊</span>}
              title="ROI Tracking"
              description="Value delivery and investment return analysis"
              delay={0.4}
            />
          </div>

          <BulletList 
            items={[
              'Complete procurement project timeline view',
              'Supplier performance benchmarking reports',
              'Category-wise spend analysis and trends',
              'Contract compliance and renewal tracking',
              'Risk assessment and mitigation history',
              'Stakeholder feedback and satisfaction scores'
            ]}
          />
        </div>
      </div>
    </Slide>,

    // Slide 6: Payment Gateway & Invoicing
    <Slide key="payment" className="bg-gradient-to-br from-rose-900/20 to-pink-900/20">
      <SlideTitle 
        subtitle="Enterprise-grade subscription management with automated billing and compliance"
        center
      >
        Subscription & Billing Management
      </SlideTitle>
      
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <VisualMockup title="Subscription Dashboard" subtitle="Enterprise plan management">
            <div className="p-6 w-full h-full flex flex-col justify-center">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">Enterprise Plan</div>
                  <div className="text-sm text-gray-700 font-medium">Next renewal: March 15, 2025</div>
                </div>
                
                <div className="bg-blue-50 rounded p-3">
                  <h4 className="font-medium text-sm mb-2 text-gray-800">Current Usage</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Active RFPs</span>
                      <span className="text-gray-800 font-medium">8 / 25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Team Members</span>
                      <span className="text-gray-800 font-medium">12 / 50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Supplier Connections</span>
                      <span className="text-gray-800 font-medium">156 / 500</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Monthly Cost</span>
                    <span className="font-bold text-gray-800">$2,499/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </VisualMockup>

          <VisualMockup title="Payment Checkout" subtitle="Secure enterprise billing" height="h-56">
            <div className="p-4 w-full h-full flex flex-col justify-center">
              <div className="bg-white rounded border p-4 space-y-3">
                <div className="text-center">
                  <div className="font-bold text-sm text-gray-800">Annual Subscription</div>
                  <div className="text-xs text-gray-600">Enterprise Plan - 12 months</div>
                </div>
                <div className="border-t pt-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subscription (12 months)</span>
                    <span className="text-gray-800 font-medium">$29,988</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Annual Discount (20%)</span>
                    <span className="text-green-600 font-medium">-$5,998</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">GST (18%)</span>
                    <span className="text-gray-800 font-medium">$4,318</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span className="text-gray-800">Total</span>
                    <span className="text-gray-800 font-bold">$28,308</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded text-xs font-medium">
                  Pay Now
                </button>
              </div>
            </div>
          </VisualMockup>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <FeatureCard
              icon={<span>💼</span>}
              title="Enterprise Plans"
              description="Scalable subscription tiers for teams of all sizes"
              delay={0.1}
            />
            <FeatureCard
              icon={<span>🔄</span>}
              title="Auto-Renewal"
              description="Seamless subscription continuation with proactive reminders"
              delay={0.2}
            />
            <FeatureCard
              icon={<span>📊</span>}
              title="Usage Analytics"
              description="Track feature utilization and optimize plan selection"
              delay={0.3}
            />
            <FeatureCard
              icon={<span>🧾</span>}
              title="Corporate Invoicing"
              description="Purchase order support and enterprise billing workflows"
              delay={0.4}
            />
          </div>

          <BulletList 
            items={[
              'Flexible subscription plans and billing cycles',
              'Corporate payment methods and purchase orders',
              'Automated invoicing with GST compliance',
              'Usage tracking and overage management',
              'Multi-currency support for global operations',
              'Dedicated account management and support'
            ]}
          />
        </div>
      </div>
    </Slide>
  ];

  return (
    <div className={`dark bg-slate-900 ${styles.darkModeForce}`}>
      <PresentationLayout title="Buyer Journey - Sales Centri Marketplace">
        {slides}
      </PresentationLayout>
    </div>
  );
}