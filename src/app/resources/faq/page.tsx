'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HelpCircle, Search, MessageCircle, ArrowRight, Users, Zap, DollarSign, BarChart3, Phone, Mail } from 'lucide-react';

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: Users,
      faqs: [
        {
          question: "How quickly can I get started with Sales Centri?",
          answer: "You can start seeing results within 24-48 hours. Our onboarding process includes setup consultation, platform configuration, and initial data integration. Most clients begin generating qualified leads within the first week."
        },
        {
          question: "Do I need technical expertise to use Sales Centri?",
          answer: "No technical expertise required. Our platform is designed for sales professionals and business owners. We provide complete setup, training, and ongoing support. Our team handles all technical aspects while you focus on closing deals."
        },
        {
          question: "What's included in the free trial?",
          answer: "Your free trial includes access to SalesGPT, 50 qualified leads, basic automation setup, email campaign management, and full customer support. No credit card required, and you can upgrade anytime during or after the trial."
        },
        {
          question: "Can I integrate Sales Centri with my existing CRM?",
          answer: "Yes, we integrate with 50+ popular CRMs including Salesforce, HubSpot, Pipedrive, and more. Our team handles the integration setup to ensure seamless data flow between platforms."
        }
      ]
    },
    {
      title: "Features & Functionality",
      icon: Zap,
      faqs: [
        {
          question: "How does SalesGPT AI work?",
          answer: "SalesGPT uses advanced AI to analyze your ideal customer profile, industry trends, and sales patterns to automatically generate qualified leads, personalized outreach, and optimized sales sequences. It learns from your preferences and improves over time."
        },
        {
          question: "What types of leads can Sales Centri generate?",
          answer: "We generate leads across all industries and company sizes. Our AI can target specific roles, industries, company sizes, technologies used, funding status, and hundreds of other criteria to match your ideal customer profile exactly."
        },
        {
          question: "How accurate is the contact data?",
          answer: "We maintain 95%+ accuracy on email addresses and 90%+ on phone numbers. Our data is verified in real-time from multiple sources and updated continuously. We also provide a data accuracy guarantee."
        },
        {
          question: "Can I customize the AI automation workflows?",
          answer: "Absolutely. Every automation workflow is fully customizable. You can modify email templates, adjust timing, set specific triggers, and create custom sequences based on lead behavior and responses."
        }
      ]
    },
    {
      title: "Pricing & Plans",
      icon: DollarSign,
      faqs: [
        {
          question: "What's the difference between plans?",
          answer: "Plans differ in lead volume, features, and support level. Starter is perfect for small teams, Professional includes advanced automation, and Enterprise offers unlimited leads plus dedicated support. All plans include core AI features."
        },
        {
          question: "Are there any setup fees or contracts?",
          answer: "No setup fees or long-term contracts required. You can start with a monthly plan and upgrade or downgrade anytime. Enterprise plans include free setup and migration assistance."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, ACH bank transfers, and wire transfers for enterprise accounts. Billing is monthly or annually, with discounts available for annual payments."
        },
        {
          question: "Can I change or cancel my plan anytime?",
          answer: "Yes, you can upgrade, downgrade, or cancel anytime from your account dashboard. Cancellations take effect at the end of your current billing period, and you retain access until then."
        }
      ]
    },
    {
      title: "Results & Performance",
      icon: BarChart3,
      faqs: [
        {
          question: "What results can I expect in the first month?",
          answer: "Most clients see 150-300% increase in qualified leads, 50-80% improvement in response rates, and 30-60% reduction in sales cycle time within the first 30 days. Results vary by industry and implementation."
        },
        {
          question: "How do you measure success?",
          answer: "We track comprehensive metrics including lead quality scores, conversion rates, response rates, pipeline growth, deal velocity, and ROI. You get detailed analytics and reporting to measure performance."
        },
        {
          question: "What if I don't see results?",
          answer: "We're confident in our platform, but if you don't see improvement within 60 days, we'll work with you to optimize your strategy at no additional cost. Enterprise clients get dedicated success managers to ensure results."
        },
        {
          question: "How does Sales Centri compare to hiring sales staff?",
          answer: "Sales Centri typically costs 70-90% less than hiring full-time sales staff while generating 2-5x more qualified leads. You get the equivalent of multiple SDRs, researchers, and marketers for a fraction of the cost."
        }
      ]
    }
  ];

  const popularQuestions = [
    {
      question: "How is Sales Centri different from other sales tools?",
      answer: "Unlike traditional tools that require manual work, Sales Centri provides complete automation with AI that actually generates and nurtures leads for you. It's like having a full sales team that works 24/7.",
      category: "General"
    },
    {
      question: "Is my data secure and compliant?",
      answer: "Yes, we're SOC 2 Type II certified, GDPR compliant, and follow enterprise-grade security practices. Your data is encrypted and never shared with third parties.",
      category: "Security"
    },
    {
      question: "What support is available?",
      answer: "All plans include email support, knowledge base access, and video tutorials. Professional and Enterprise plans get priority support and dedicated success managers.",
      category: "Support"
    }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Get instant answers to your questions",
      icon: MessageCircle,
      action: "Start Chat",
      available: "24/7"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our experts",
      icon: Phone,
      action: "Call Now",
      available: "Business Hours"
    },
    {
      title: "Email Support",
      description: "Detailed responses within 2 hours",
      icon: Mail,
      action: "Send Email",
      available: "24/7"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Frequently Asked Questions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Everything You Need to Know:
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> Everything You Need to Know</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Find quick answers to the most common questions about Sales Centri, from getting started 
              to advanced features, pricing, and results. Can&apos;t find what you&apos;re looking for? Our 
              support team is available 24/7 to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer block text-center">
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/70 transition-all duration-300"
            />
          </motion.div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Most Popular Questions</h2>
          </motion.div>
          
          <div className="space-y-6">
            {popularQuestions.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-300 mb-2">{faq.answer}</p>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-xs font-medium">
                      {faq.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Find detailed answers organized by topic.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                </div>
                
                <div className="space-y-6">
                  {category.faqs.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-b border-gray-700/30 pb-6 last:border-b-0 last:pb-0">
                      <h4 className="text-lg font-semibold text-white mb-3">{faq.question}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Options */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our support team is here to help you succeed. Choose your preferred contact method.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm text-center hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{option.title}</h3>
                <p className="text-gray-300 mb-4">{option.description}</p>
                <div className="text-sm text-blue-300 mb-6">Available {option.available}</div>
                <Link href="/contact" className="w-full block bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer">
                  {option.action}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-blue-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already transforming their sales with Sales Centri.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Book Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
