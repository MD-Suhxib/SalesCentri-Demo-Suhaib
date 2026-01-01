import { motion } from 'framer-motion';
import { Search, Target, ArrowRight, CheckCircle, Zap, Layers, Link as LinkIcon } from 'lucide-react';
import { Navigation } from '../Navigation';
import { ProductPageNav } from '../ProductPageNav';

export const ProductPageTemplate = () => {
  // Page sections for in-page navigation
  const pageSections = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'testimonials', label: 'Testimonials' }
  ];

  // Features list for feature section
  const features = [
    {
      icon: Search,
      title: "Intelligent Search",
      description: "Advanced search capabilities using AI to find the most relevant results"
    },
    {
      icon: Target, 
      title: "Precision Targeting",
      description: "Laser-focused targeting to reach exactly the audience you need"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance ensures you get results in seconds, not minutes"
    },
    {
      icon: Layers,
      title: "Advanced Filtering",
      description: "Multi-layer filtering to refine your results with precision"
    }
  ];

  // Integration platforms
  const integrations = [
    { name: "Salesforce", logo: "/logos/salesforce.svg" },
    { name: "HubSpot", logo: "/logos/hubspot.svg" },
    { name: "Zoho", logo: "/logos/zoho.svg" },
    { name: "Marketo", logo: "/logos/marketo.svg" },
    { name: "Pipedrive", logo: "/logos/pipedrive.svg" },
    { name: "Microsoft Dynamics", logo: "/logos/microsoft.svg" }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      period: "per month",
      description: "Perfect for small teams and startups",
      features: [
        "Up to 1,000 contacts",
        "Basic search filters",
        "Email validation",
        "1 team member",
        "Email support"
      ],
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "$149",
      period: "per month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 5,000 contacts",
        "Advanced search filters",
        "Email & phone validation",
        "5 team members",
        "Priority email support",
        "API access"
      ],
      cta: "Go Professional",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited contacts",
        "All filters and features",
        "Full validation suite",
        "Unlimited team members",
        "24/7 priority support",
        "Advanced API access",
        "Custom integrations"
      ],
      cta: "Try SalesGPT"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "This tool has transformed how we identify and connect with potential clients.",
      author: "Sarah Johnson",
      position: "Sales Director, TechGrowth Inc."
    },
    {
      quote: "We've seen a 40% increase in qualified leads since implementing this solution.",
      author: "Michael Chen",
      position: "Marketing Manager, FutureSales"
    },
    {
      quote: "The accuracy and speed of this platform have given us a competitive edge in our industry.",
      author: "Rachel Patel",
      position: "CEO, LeadGen Solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section id="overview" className="pt-32 pb-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">AI-Powered Solution</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Product{' '}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Name
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                This is your product description. It should be concise yet compelling, explaining what your product does and why it matters. Focus on the main value proposition that sets it apart from competitors.
              </p>

              <motion.button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Product Dashboard</h3>
                  <div className="flex items-center space-x-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm">Live Demo</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Metric One", value: "94%", status: "Excellent" },
                    { label: "Metric Two", value: "1,240", status: "Growing" },
                    { label: "Metric Three", value: "82%", status: "Good" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-gray-400 text-sm">{item.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-400 font-bold">{item.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* In-page Navigation */}
      <ProductPageNav sections={pageSections} />

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Powerful{' '}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover what makes our product the preferred choice for businesses worldwide
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Seamless{' '}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Integrations
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Connect with your favorite tools and platforms for a unified workflow
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 mb-3 flex items-center justify-center">
                  <LinkIcon className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-300 text-center font-medium">{integration.name}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <motion.button
              className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-6 py-3 rounded-lg font-medium hover:bg-blue-500/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Integrations
            </motion.button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Simple, Transparent{' '}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that works best for your needs
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-br ${
                    plan.highlighted 
                      ? 'from-blue-900/20 to-blue-800/10 border-blue-500/50' 
                      : 'from-gray-900/50 to-black/50 border-gray-800'
                  } backdrop-blur-xl border rounded-2xl p-8 flex flex-col ${
                    plan.highlighted ? 'shadow-lg shadow-blue-500/10' : ''
                  }`}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <h3 className={`text-2xl font-bold ${plan.highlighted ? 'text-blue-300' : 'text-white'} mb-2`}>
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-8">{plan.description}</p>

                  <div className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className={`w-5 h-5 ${plan.highlighted ? 'text-blue-400' : 'text-green-400'}`} />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className={`mt-auto w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {plan.cta}
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Customer{' '}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Testimonials
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what our customers have to say about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <p className="text-gray-300 italic mb-6">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <p className="text-white font-medium">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.position}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPageTemplate;
