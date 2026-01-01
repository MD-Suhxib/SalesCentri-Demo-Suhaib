'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Code, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Server,
  Cloud,
  Cpu,
  Database,
  Globe,
  Monitor,
  Award,
  Target,
  Settings,
  Layers,
  GitBranch,
  Terminal,
  Smartphone
} from 'lucide-react';

export default function ITPage() {
  return (
    <div className="min-h-screen bg-[#0B1426] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 mb-6"
            >
              <Code className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Technology Sales Automation</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                IT Sales
              </span>
              <br />
              <span className="text-white">Acceleration</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Advanced sales automation platform built for IT companies, software vendors, and technology 
              service providers. Accelerate complex technical sales cycles and maximize enterprise deals 
              with intelligent automation.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Tech Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                Schedule Tech Consultation
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: "127%", label: "Enterprise Deal Size" },
              { number: "89%", label: "Technical Evaluation Speed" },
              { number: "156%", label: "Solution Adoption Rate" },
              { number: "234%", label: "Partner Channel Growth" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* IT Sales Challenges */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Technology Sales Challenges We Solve
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              IT sales teams face unique technical and enterprise challenges. Our platform conquers them all.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "Complex Technical Sales",
                description: "Multi-layered technical solutions require extensive proof-of-concept and stakeholder buy-in.",
                solution: "Technical sales workflow automation with demo scheduling and POC tracking"
              },
              {
                icon: Clock,
                title: "Extended Sales Cycles",
                description: "Enterprise IT decisions can take 12+ months with multiple evaluation phases.",
                solution: "Long-cycle nurturing with technical content and milestone automation"
              },
              {
                icon: Users,
                title: "Multiple Decision Makers",
                description: "IT purchases involve technical teams, executives, procurement, and end-users.",
                solution: "Stakeholder mapping with role-based technical and business content"
              },
              {
                icon: Shield,
                title: "Security & Compliance",
                description: "Enterprise IT buyers require extensive security documentation and compliance proof.",
                solution: "Automated security questionnaire responses and compliance documentation"
              },
              {
                icon: GitBranch,
                title: "Solution Complexity",
                description: "Technical solutions require customization discussions and integration planning.",
                solution: "Technical requirements gathering and solution configuration automation"
              },
              {
                icon: Globe,
                title: "Channel Partner Management",
                description: "Managing reseller relationships and partner-driven sales opportunities.",
                solution: "Partner portal automation and channel sales enablement workflows"
              }
            ].map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <challenge.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{challenge.title}</h3>
                <p className="text-gray-400 mb-4">{challenge.description}</p>
                <div className="bg-blue-500/10 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-blue-300 text-sm font-medium">{challenge.solution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IT-Specific Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/10 to-cyan-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Technology Sales Enablement Tools
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced features designed for software vendors, IT service providers, and technology companies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                {[
                  {
                    icon: Terminal,
                    title: "Technical Content Engine",
                    description: "Automatically deliver relevant technical documentation, API guides, and integration resources based on prospect requirements."
                  },
                  {
                    icon: Cloud,
                    title: "Demo Environment Management",
                    description: "Automated demo provisioning and sandbox environment setup for technical evaluations and POCs."
                  },
                  {
                    icon: Database,
                    title: "Technical Requirements Tracking",
                    description: "Capture and track technical specifications, integration needs, and compliance requirements throughout the sales cycle."
                  },
                  {
                    icon: Settings,
                    title: "Solution Configuration Builder",
                    description: "Interactive tools to configure technical solutions and generate accurate proposals and statements of work."
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Technology Sales Metrics</h3>
              <div className="space-y-6">
                {[
                  { metric: "Technical Evaluation Time", improvement: "↓ 58%", color: "text-green-400" },
                  { metric: "POC Success Rate", improvement: "↑ 167%", color: "text-blue-400" },
                  { metric: "Enterprise Deal Size", improvement: "↑ 127%", color: "text-cyan-400" },
                  { metric: "Partner Channel Revenue", improvement: "↑ 234%", color: "text-purple-400" },
                  { metric: "Technical Win Rate", improvement: "↑ 89%", color: "text-green-400" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{item.metric}</span>
                    <span className={`font-semibold ${item.color}`}>{item.improvement}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Sales Workflow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Enterprise Technology Sales Process
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamlined workflows for complex technical sales, from lead qualification to enterprise deployment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Technical Lead Qualification",
                description: "AI-powered qualification of technical requirements, budget, and decision-making process",
                icon: Target
              },
              {
                step: "02", 
                title: "Stakeholder Mapping",
                description: "Identify technical champions, business decision makers, and procurement stakeholders",
                icon: Users
              },
              {
                step: "03",
                title: "Technical Evaluation",
                description: "Automated demo scheduling, POC management, and technical documentation delivery",
                icon: Monitor
              },
              {
                step: "04",
                title: "Enterprise Closing",
                description: "Contract automation, security reviews, and implementation planning coordination",
                icon: Award
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Segments */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/10 to-cyan-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Technology Segments We Serve
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized solutions for every technology vertical and business model.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Cloud,
                title: "SaaS & Cloud Platforms",
                description: "Subscription-based software sales with trial conversions and expansion revenue automation.",
                features: ["Free trial optimization", "Usage-based upselling", "Churn prevention"]
              },
              {
                icon: Shield,
                title: "Cybersecurity Solutions",
                description: "Security-focused sales processes with compliance requirements and threat-based selling.",
                features: ["Risk assessment automation", "Compliance tracking", "Security ROI modeling"]
              },
              {
                icon: Server,
                title: "Enterprise Infrastructure",
                description: "Hardware and infrastructure sales with complex technical evaluations and implementations.",
                features: ["Technical requirement gathering", "Solution sizing", "Implementation planning"]
              },
              {
                icon: Smartphone,
                title: "Mobile & App Development",
                description: "Custom development services with project scoping and technical requirement management.",
                features: ["Project scoping automation", "Technical estimation", "Development milestone tracking"]
              },
              {
                icon: Database,
                title: "Data & Analytics",
                description: "Data platform sales with technical integrations and analytics use case development.",
                features: ["Use case identification", "Integration planning", "Data migration support"]
              },
              {
                icon: Cpu,
                title: "AI & Machine Learning",
                description: "AI solution sales with model training, deployment, and performance optimization.",
                features: ["AI use case mapping", "Model performance tracking", "Training data requirements"]
              }
            ].map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <segment.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{segment.title}</h3>
                <p className="text-gray-400 mb-4">{segment.description}</p>
                <ul className="space-y-2">
                  {segment.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-blue-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-cyan-700/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Accelerate Your Technology Sales?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join technology companies that have increased enterprise deal sizes by 127% and reduced technical evaluation time by 58% with our specialized platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Technology Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                Schedule Strategy Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
