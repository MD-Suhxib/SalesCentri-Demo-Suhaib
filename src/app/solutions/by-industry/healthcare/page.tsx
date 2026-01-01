'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Heart, 
  Shield, 
  Users, 
  Clock, 
  ArrowRight, 
  Stethoscope,
  Activity,
  UserCheck,
  FileText,
  Lock,
  Award,
  Target,
  MessageSquare,
  BarChart3
} from 'lucide-react';

export default function HealthcarePage() {
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
              <Heart className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Healthcare Sales Automation</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Healthcare Sales
              </span>
              <br />
              <span className="text-white">Revolution</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              HIPAA-compliant sales automation platform designed for healthcare organizations. 
              Streamline patient acquisition, provider relationships, and medical device sales 
              while maintaining the highest security standards.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Healthcare Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                Schedule Consultation
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
              { number: "89%", label: "Patient Satisfaction" },
              { number: "156%", label: "Lead Response Speed" },
              { number: "73%", label: "Compliance Rate" },
              { number: "245%", label: "Provider Engagement" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Healthcare Challenges */}
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
              Healthcare Sales Challenges We Solve
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Healthcare organizations face unique sales challenges. Our platform addresses them all.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "HIPAA Compliance Complexity",
                description: "Navigate complex privacy regulations while maintaining effective patient communication and data management.",
                solution: "Built-in HIPAA compliance with encrypted communications and audit trails"
              },
              {
                icon: Clock,
                title: "Long Sales Cycles",
                description: "Healthcare decisions involve multiple stakeholders and extensive evaluation periods.",
                solution: "Automated nurturing sequences designed for healthcare decision timelines"
              },
              {
                icon: Users,
                title: "Multi-Stakeholder Decisions",
                description: "Healthcare purchases involve doctors, administrators, IT, and procurement teams.",
                solution: "Stakeholder mapping and role-based communication workflows"
              },
              {
                icon: FileText,
                title: "Complex Documentation",
                description: "Healthcare sales require extensive clinical evidence and regulatory documentation.",
                solution: "Automated document management and clinical evidence delivery"
              },
              {
                icon: Activity,
                title: "Patient Acquisition",
                description: "Attracting and converting patients while maintaining trust and compliance.",
                solution: "Patient journey automation with personalized health content"
              },
              {
                icon: Award,
                title: "Provider Relationships",
                description: "Building and maintaining relationships with healthcare providers and referral sources.",
                solution: "Provider relationship management and referral tracking systems"
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

      {/* Healthcare-Specific Features */}
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
              Healthcare-Specific Sales Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Purpose-built tools for healthcare sales teams, providers, and medical device companies.
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
                    icon: Lock,
                    title: "HIPAA-Compliant CRM",
                    description: "Secure patient data management with encryption, access controls, and audit trails meeting all HIPAA requirements."
                  },
                  {
                    icon: Stethoscope,
                    title: "Clinical Evidence Engine",
                    description: "Automatically deliver relevant clinical studies, outcomes data, and evidence-based content to prospects."
                  },
                  {
                    icon: UserCheck,
                    title: "Patient Journey Automation",
                    description: "Nurture patient leads with personalized health content and appointment scheduling automation."
                  },
                  {
                    icon: MessageSquare,
                    title: "Provider Communication Hub",
                    description: "Secure messaging platform for healthcare provider relationships and referral management."
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
              <h3 className="text-2xl font-bold text-white mb-6">Healthcare Success Metrics</h3>
              <div className="space-y-6">
                {[
                  { metric: "Patient Acquisition Cost", improvement: "↓ 68%", color: "text-green-400" },
                  { metric: "Provider Response Rate", improvement: "↑ 134%", color: "text-blue-400" },
                  { metric: "Compliance Audit Score", improvement: "↑ 89%", color: "text-cyan-400" },
                  { metric: "Referral Conversion", improvement: "↑ 156%", color: "text-purple-400" },
                  { metric: "Patient Satisfaction", improvement: "↑ 78%", color: "text-green-400" }
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

      {/* Healthcare Workflow */}
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
              Healthcare Sales Workflow
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamlined processes for patient acquisition, provider relationships, and medical device sales.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Patient/Lead Identification",
                description: "HIPAA-compliant lead capture from website forms, referrals, and healthcare directories",
                icon: Target
              },
              {
                step: "02", 
                title: "Compliance Verification",
                description: "Automated compliance checks and consent management before engagement begins",
                icon: Shield
              },
              {
                step: "03",
                title: "Personalized Outreach",
                description: "Health-focused content delivery and appointment scheduling with provider coordination",
                icon: MessageSquare
              },
              {
                step: "04",
                title: "Outcome Tracking",
                description: "Patient satisfaction monitoring and provider relationship management with ROI analytics",
                icon: BarChart3
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
              Ready to Transform Your Healthcare Sales?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join healthcare organizations that have improved patient acquisition by 89% and provider engagement by 245% with our HIPAA-compliant platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Healthcare Demo
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
