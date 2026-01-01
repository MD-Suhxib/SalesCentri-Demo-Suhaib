'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Globe, Award, FileText, ArrowRight, Eye, Server, Key, Clock } from 'lucide-react';

export default function TrustCompliancePage() {
  const certifications = [
    {
      name: "SOC 2 Type II",
      description: "Independently audited security controls for data protection",
      icon: Shield,
      status: "Certified"
    },
    {
      name: "ISO 27001",
      description: "International standard for information security management",
      icon: Award,
      status: "Certified"
    },
    {
      name: "GDPR Compliant",
      description: "Full compliance with European data protection regulations",
      icon: Globe,
      status: "Compliant"
    },
    {
      name: "CCPA Compliant",
      description: "California Consumer Privacy Act compliance",
      icon: Eye,
      status: "Compliant"
    },
    {
      name: "HIPAA Ready",
      description: "Healthcare data security and privacy standards",
      icon: FileText,
      status: "Ready"
    },
    {
      name: "PCI DSS",
      description: "Payment card industry data security standards",
      icon: Key,
      status: "Compliant"
    }
  ];

  const securityFeatures = [
    {
      title: "End-to-End Encryption",
      description: "All data encrypted in transit and at rest using AES-256 encryption",
      icon: Lock
    },
    {
      title: "Multi-Factor Authentication",
      description: "Mandatory MFA for all user accounts with support for SAML/SSO",
      icon: Key
    },
    {
      title: "Data Residency Control",
      description: "Choose where your data is stored with regional data centers",
      icon: Server
    },
    {
      title: "Audit Logging",
      description: "Comprehensive audit trails for all system activities and access",
      icon: FileText
    },
    {
      title: "Regular Security Scans",
      description: "Continuous vulnerability assessments and penetration testing",
      icon: Shield
    },
    {
      title: "24/7 Security Monitoring",
      description: "Round-the-clock security operations center monitoring",
      icon: Clock
    }
  ];

  const privacyPrinciples = [
    {
      title: "Data Minimization",
      description: "We collect only the data necessary for providing our services",
      commitment: "We never collect unnecessary personal information"
    },
    {
      title: "Transparency",
      description: "Clear disclosure of what data we collect and how it's used",
      commitment: "Full transparency in our data practices"
    },
    {
      title: "User Control",
      description: "You maintain full control over your data and can export or delete it anytime",
      commitment: "Your data, your control, always"
    },
    {
      title: "Purpose Limitation",
      description: "Data is used only for the specific purposes for which it was collected",
      commitment: "No secondary use without explicit consent"
    }
  ];

  const trustStats = [
    { label: "Enterprise Clients", value: "500+" },
    { label: "Uptime Guarantee", value: "99.9%" },
    { label: "Security Audits", value: "Quarterly" },
    { label: "Data Centers", value: "Global" }
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
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Trust & Compliance</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Enterprise-Grade Security:
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Your Data, Our Priority</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Built with enterprise security and compliance at its core, Sales Centri meets the most 
              stringent industry standards. With SOC 2 Type II certification, GDPR compliance, and 
              enterprise-grade security controls, we ensure your data is protected while you focus on growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Start Secure with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
              >
                Security Assessment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Security Certifications & Compliance</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We maintain the highest security standards with industry-recognized certifications and compliance frameworks.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <cert.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{cert.name}</h3>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-md text-xs font-medium">
                      {cert.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Advanced Security Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Multi-layered security architecture protecting your data at every level.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Privacy by Design</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our commitment to privacy goes beyond compliance - it&apos;s built into everything we do.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {privacyPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-white mb-3">{principle.title}</h3>
                <p className="text-gray-300 mb-4">{principle.description}</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-green-300 font-medium">{principle.commitment}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Your Data Protection Rights
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                We respect your data rights and provide full control over your information.
              </p>
              <div className="space-y-4">
                {[
                  "Right to access your personal data",
                  "Right to rectify inaccurate information",
                  "Right to erase your data",
                  "Right to data portability",
                  "Right to restrict processing",
                  "Right to object to processing"
                ].map((right, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{right}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Security Incident Response</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Immediate Detection</h4>
                    <p className="text-gray-300 text-sm">24/7 monitoring systems detect and alert within minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Rapid Response</h4>
                    <p className="text-gray-300 text-sm">Security team responds and contains threat within 1 hour</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Transparent Communication</h4>
                    <p className="text-gray-300 text-sm">Affected customers notified within 72 hours as required</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Trust Documentation</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Download our security and compliance documentation for your review.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { title: "Security Whitepaper", description: "Comprehensive overview of our security architecture", type: "PDF" },
              { title: "SOC 2 Type II Report", description: "Independent audit of our security controls", type: "PDF" },
              { title: "Privacy Policy", description: "How we collect, use, and protect your data", type: "Web" },
              { title: "Terms of Service", description: "Legal terms governing use of our services", type: "Web" },
              { title: "Data Processing Agreement", description: "GDPR-compliant DPA for enterprise customers", type: "PDF" },
              { title: "Incident Response Plan", description: "Our procedures for handling security incidents", type: "PDF" }
            ].map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-medium">
                    {doc.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-gray-300 text-sm">{doc.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-purple-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready for Enterprise-Grade Security?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start with confidence knowing your data is protected by industry-leading security controls.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start Secure with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/contact-form" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Contact Security Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
