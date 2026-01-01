'use client';

import { motion } from 'framer-motion';
import { Link as LinkIcon, Zap, Database, Shield, CheckCircle, ArrowRight, Code, Webhook, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HunterValidatorIntegrationsPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/hunter-validator', active: false },
    { name: 'Features', href: '/platforms/contact-intelligence/hunter-validator/features', active: false },
    { name: 'Integrations', href: '/platforms/contact-intelligence/hunter-validator/integrations', active: pathname === '/platforms/contact-intelligence/hunter-validator/integrations' },
    { name: 'Pricing', href: '/platforms/contact-intelligence/hunter-validator/pricing', active: false }
  ];

  const crmIntegrations = [
    {
      name: "Salesforce",
      logo: "SF",
      description: "Seamlessly sync validated contacts directly into your Salesforce pipeline with real-time updates.",
      features: ["Real-time sync", "Custom field mapping", "Bulk operations", "Workflow automation"],
      setupTime: "5 minutes"
    },
    {
      name: "HubSpot", 
      logo: "HS",
      description: "Enhance your HubSpot contacts with verified email addresses and improved deliverability.",
      features: ["Contact enrichment", "List segmentation", "Email validation", "Lead scoring"],
      setupTime: "3 minutes"
    },
    {
      name: "Pipedrive",
      logo: "PD", 
      description: "Keep your Pipedrive pipeline clean with automated contact validation and data enhancement.",
      features: ["Pipeline automation", "Contact verification", "Deal insights", "Activity tracking"],
      setupTime: "4 minutes"
    },
    {
      name: "Zoho CRM",
      logo: "ZC",
      description: "Integrate validated contact data directly into your Zoho CRM for better lead management.",
      features: ["Data synchronization", "Validation workflows", "Custom modules", "Report integration"],
      setupTime: "6 minutes"
    },
    {
      name: "Monday.com", 
      logo: "MC",
      description: "Streamline your Monday.com workflows with accurate contact data and validation status.",
      features: ["Board automation", "Status tracking", "Team collaboration", "Progress monitoring"],
      setupTime: "5 minutes"
    },
    {
      name: "Airtable",
      logo: "AT",
      description: "Enhance your Airtable databases with verified contact information and quality scores.",
      features: ["Base synchronization", "Field validation", "Automation rules", "View filtering"],
      setupTime: "3 minutes"
    }
  ];

  const apiFeatures = [
    {
      icon: Zap,
      title: "RESTful API",
      description: "High-performance REST API with 99.9% uptime and sub-second response times.",
      specs: ["JSON responses", "Rate limiting", "Authentication", "Error handling"]
    },
    {
      icon: Webhook,
      title: "Webhook Support", 
      description: "Real-time notifications for validation results and processing status updates.",
      specs: ["Event notifications", "Retry logic", "Payload customization", "Security headers"]
    },
    {
      icon: Database,
      title: "Bulk Processing",
      description: "Process thousands of contacts simultaneously with our batch validation system.",
      specs: ["Queue management", "Progress tracking", "Result callbacks", "Error reporting"]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with SOC 2 compliance and data encryption.",
      specs: ["TLS encryption", "API keys", "IP whitelisting", "Audit logs"]
    }
  ];

  const integrationSteps = [
    {
      step: "1",
      title: "Choose Integration",
      description: "Select your preferred CRM or use our API for custom integrations"
    },
    {
      step: "2", 
      title: "Configure Settings",
      description: "Set up field mapping, validation rules, and automation triggers"
    },
    {
      step: "3",
      title: "Test Connection",
      description: "Verify the integration works correctly with sample data"
    },
    {
      step: "4",
      title: "Go Live",
      description: "Activate the integration and start validating contacts automatically"
    }
  ];

  const developmentResources = [
    "Comprehensive API documentation",
    "SDKs for popular programming languages",
    "Postman collection for testing",
    "Code examples and tutorials",
    "Developer sandbox environment",
    "24/7 technical support"
  ];

  return (
    <>
      {/* Sub-navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <nav className="flex space-x-8">
              {subNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`py-4 px-2 text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <LinkIcon className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Seamless Integrations</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Connect with Your{' '}
                <span className="text-blue-400">Existing Tools</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Seamlessly integrate Hunter & Validator with your existing CRM, marketing automation, 
                and sales tools. No workflow disruption, just enhanced contact quality.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Integrations
                </motion.button>
                <motion.button
                  className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View API Docs
                </motion.button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">50+</div>
                  <div className="text-gray-400 text-sm">Integrations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">99.9%</div>
                  <div className="text-gray-400 text-sm">API Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">0.5s</div>
                  <div className="text-gray-400 text-sm">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CRM Integrations */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Popular CRM Integrations</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Connect with leading CRM platforms to automatically validate and enhance your contact data.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {crmIntegrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-sm">{integration.logo}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{integration.name}</h3>
                      <div className="text-blue-400 text-sm">Setup: {integration.setupTime}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed mb-6">{integration.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {integration.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className="w-full bg-gradient-to-r from-blue-600/20 to-blue-600/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg font-medium hover:bg-blue-600/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Setup Integration
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* API Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Powerful API & Webhooks</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Build custom integrations with our robust API designed for enterprise-scale operations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {apiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
                >
                  <feature.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{feature.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {feature.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{spec}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Process */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">4-Step Integration Process</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get up and running quickly with our streamlined integration process.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {integrationSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-400 font-bold text-lg">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                  
                  {index < integrationSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-blue-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Resources */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Developer Resources</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Everything your development team needs to integrate quickly and efficiently, 
                  with comprehensive documentation and support.
                </p>

                <div className="space-y-4 mb-8">
                  {developmentResources.map((resource, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300">{resource}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Code className="w-5 h-5" />
                    <span>View API Docs</span>
                  </motion.button>
                  <motion.button
                    className="border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download SDKs
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
              >
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-2">Sample Integration Code</h3>
                  <div className="text-gray-400 text-sm">JavaScript/Node.js</div>
                </div>

                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                  <div className="text-blue-400">const</div>{` `}
                  <div className="text-blue-400 inline">response</div>{` = `}
                  <div className="text-blue-400 inline">await</div>{` `}
                  <div className="text-blue-400 inline">fetch</div>
                  <div className="text-gray-300 inline">(</div>
                  <br />
                  <div className="text-blue-400 ml-4">&apos;https://api.salescentri.com/validate&apos;,</div>
                  <br />
                  <div className="text-gray-300 ml-4">{`{`}</div>
                  <br />
                  <div className="text-blue-400 ml-8">method</div>
                  <div className="text-gray-300 inline">: </div>
                  <div className="text-blue-400 inline">&apos;POST&apos;</div>
                  <div className="text-gray-300 inline">,</div>
                  <br />
                  <div className="text-blue-400 ml-8">headers</div>
                  <div className="text-gray-300 inline">: {`{`}</div>
                  <br />
                  <div className="text-blue-400 ml-12">&apos;Authorization&apos;</div>
                  <div className="text-gray-300 inline">: </div>
                  <div className="text-blue-400 inline">&apos;Bearer YOUR_API_KEY&apos;</div>
                  <br />
                  <div className="text-gray-300 ml-8">{`}`},</div>
                  <br />
                  <div className="text-blue-400 ml-8">body</div>
                  <div className="text-gray-300 inline">: </div>
                  <div className="text-blue-400 inline">JSON</div>
                  <div className="text-gray-300 inline">.</div>
                  <div className="text-blue-400 inline">stringify</div>
                  <div className="text-gray-300 inline">({`{`}</div>
                  <br />
                  <div className="text-blue-400 ml-12">emails</div>
                  <div className="text-gray-300 inline">: [</div>
                  <div className="text-blue-400 inline">&apos;test@example.com&apos;</div>
                  <div className="text-gray-300 inline">]</div>
                  <br />
                  <div className="text-gray-300 ml-8">{`})`}</div>
                  <br />
                  <div className="text-gray-300 ml-4">{`}`}</div>
                  <br />
                  <div className="text-gray-300">);</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Globe className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Integrate with Your Tech Stack?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Connect Hunter & Validator with your existing tools in minutes and start 
                improving your contact quality immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Integration Setup
                </motion.button>
                <motion.button
                  className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Talk to Integration Expert
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
