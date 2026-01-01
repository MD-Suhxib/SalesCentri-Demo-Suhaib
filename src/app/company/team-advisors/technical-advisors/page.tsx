'use client';

import { motion } from 'framer-motion';
import { Brain, Code, Shield, Zap, Globe, Database, Cpu, Network, CheckCircle, Award, Linkedin, Mail, Users } from 'lucide-react';
export default function TechnicalAdvisorsPage() {
  const technicalAdvisors = [
    {
      name: "Dr. Elena Vasquez",
      role: "AI & Machine Learning Advisor",
      company: "Former Principal Scientist at OpenAI",
      experience: "15+ years",
      background: "Led breakthrough research in natural language processing and conversational AI at OpenAI. PhD in Computer Science from Stanford, specialized in deep learning architectures.",
      expertise: ["Natural Language Processing", "Deep Learning", "Conversational AI", "AI Ethics"],
      achievements: ["Co-authored 45+ peer-reviewed papers", "Led development of GPT conversational models", "Pioneer in ethical AI frameworks"],
      technologies: ["Python", "TensorFlow", "PyTorch", "Transformers", "BERT", "GPT"],
      focus: "Advancing Sales Centri's AI personalization and voice technology capabilities",
      quote: "Sales Centri's approach to AI-human collaboration in sales represents the future of how we'll interact with intelligent systems.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Michael Zhang",
      role: "Cloud Architecture Advisor", 
      company: "Former Staff Engineer at Google Cloud",
      experience: "18+ years",
      background: "Architected large-scale distributed systems at Google Cloud serving billions of requests. Expert in microservices, container orchestration, and serverless architectures.",
      expertise: ["Cloud Architecture", "Distributed Systems", "Microservices", "DevOps"],
      achievements: ["Built systems serving 10B+ daily requests", "Led Google Cloud's enterprise platform", "Designed fault-tolerant architectures"],
      technologies: ["Kubernetes", "Docker", "AWS", "GCP", "Terraform", "Go", "Node.js"],
      focus: "Ensuring Sales Centri's platform scales reliably to millions of users globally",
      quote: "Building AI platforms that scale requires getting the fundamentals right. Sales Centri's architecture is enterprise-grade from day one.",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Dr. Aisha Patel",
      role: "Data Science & Analytics Advisor",
      company: "Former Head of Data Science at Uber",
      experience: "12+ years",
      background: "Built Uber's global data science platform, developing ML models for demand forecasting, pricing optimization, and user behavior analysis. PhD in Statistics from MIT.",
      expertise: ["Data Science", "Machine Learning", "Predictive Analytics", "A/B Testing"],
      achievements: ["Built ML platform serving 100M+ users", "Developed real-time recommendation engines", "Led data science team of 150+ scientists"],
      technologies: ["Python", "R", "Spark", "Kafka", "Snowflake", "Tableau", "SQL"],
      focus: "Optimizing Sales Centri's lead scoring, personalization, and campaign effectiveness algorithms",
      quote: "Data-driven personalization at scale is incredibly challenging. Sales Centri's approach to real-time AI decision making is impressive.",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Robert Kim",
      role: "Security & Compliance Advisor",
      company: "Former CISO at Stripe",
      experience: "20+ years",
      background: "Led security and compliance initiatives at Stripe, ensuring PCI compliance and enterprise-grade security. Expert in data privacy, SOC 2, and international compliance frameworks.",
      expertise: ["Cybersecurity", "Data Privacy", "Compliance", "Risk Management"],
      achievements: ["Achieved SOC 2 Type II compliance", "Led security for $10B+ in transactions", "Built enterprise security frameworks"],
      technologies: ["Zero Trust Architecture", "SIEM", "IAM", "Encryption", "Kubernetes Security"],
      focus: "Ensuring Sales Centri meets the highest security and compliance standards for enterprise customers",
      quote: "Enterprise customers demand bank-level security. Sales Centri's commitment to security and privacy is exceptional.",
      color: "from-red-500 to-orange-500"
    },
    {
      name: "Lisa Rodriguez",
      role: "Product & UX Advisor",
      company: "Former VP of Product at Figma",
      experience: "14+ years",
      background: "Led product development at Figma during hypergrowth phase. Expert in product strategy, user experience design, and product-led growth methodologies.",
      expertise: ["Product Strategy", "UX Design", "Product-Led Growth", "User Research"],
      achievements: ["Grew Figma from 1M to 50M+ users", "Built collaborative design platform", "Pioneered real-time collaboration UX"],
      technologies: ["React", "TypeScript", "Figma", "Amplitude", "Mixpanel", "WebRTC"],
      focus: "Optimizing Sales Centri's user experience and product-market fit across all customer segments",
      quote: "The best enterprise tools feel consumer-grade. Sales Centri strikes that perfect balance of power and simplicity.",
      color: "from-yellow-500 to-amber-500"
    },
    {
      name: "Dr. James Wilson",
      role: "Voice AI & NLP Advisor",
      company: "Former Research Director at Amazon Alexa",
      experience: "16+ years",
      background: "Led Alexa's voice AI research team, developing breakthrough technologies in speech recognition, natural language understanding, and voice synthesis.",
      expertise: ["Voice AI", "Speech Recognition", "Natural Language Understanding", "Voice Synthesis"],
      achievements: ["Built Alexa's core NLU engine", "50+ patents in voice technology", "Led team of 100+ voice AI researchers"],
      technologies: ["ASR", "NLU", "TTS", "WebRTC", "Python", "C++", "Deep Learning"],
      focus: "Advancing Sales Centri's voice AI dialer technology and conversational capabilities",
      quote: "Voice AI that sounds natural and understands context is the holy grail. Sales Centri is achieving what others only dream of.",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const technicalAreas = [
    {
      title: "Artificial Intelligence",
      description: "Advanced AI models and machine learning capabilities",
      icon: Brain,
      color: "text-blue-400",
      technologies: ["Natural Language Processing", "Deep Learning", "Conversational AI", "Predictive Analytics"],
      focus: "Building AI that understands context, personalizes at scale, and delivers human-like interactions"
    },
    {
      title: "Cloud Infrastructure",
      description: "Scalable, reliable, and secure cloud architecture",
      icon: Globe,
      color: "text-green-400",
      technologies: ["Microservices", "Container Orchestration", "Auto-scaling", "Global CDN"],
      focus: "Ensuring 99.9% uptime and sub-second response times for millions of users worldwide"
    },
    {
      title: "Data Engineering",
      description: "Real-time data processing and analytics platform",
      icon: Database,
      color: "text-purple-400",
      technologies: ["Real-time Analytics", "Data Pipelines", "ML Feature Stores", "Business Intelligence"],
      focus: "Processing billions of data points to deliver instant insights and AI-powered recommendations"
    },
    {
      title: "Security & Privacy",
      description: "Enterprise-grade security and compliance",
      icon: Shield,
      color: "text-red-400",
      technologies: ["Zero Trust Security", "End-to-end Encryption", "SOC 2 Compliance", "GDPR/CCPA"],
      focus: "Protecting customer data with bank-level security and meeting global compliance standards"
    },
    {
      title: "Voice Technology",
      description: "Advanced voice AI and communication systems",
      icon: Cpu,
      color: "text-yellow-400",
      technologies: ["Speech Recognition", "Voice Synthesis", "Real-time Communication", "WebRTC"],
      focus: "Creating natural, human-like voice interactions that build genuine customer relationships"
    },
    {
      title: "Product Innovation",
      description: "User-centric design and product development",
      icon: Zap,
      color: "text-cyan-400",
      technologies: ["React", "TypeScript", "Mobile-First Design", "Real-time Collaboration"],
      focus: "Building intuitive interfaces that make complex AI capabilities accessible to every user"
    }
  ];

  const techStats = [
    { metric: "99.9%", label: "Platform Uptime", description: "Enterprise reliability" },
    { metric: "< 100ms", label: "API Response Time", description: "Lightning fast" },
    { metric: "50B+", label: "Data Points Processed", description: "Monthly volume" },
    { metric: "256-bit", label: "Encryption Standard", description: "Military grade" },
    { metric: "150+", label: "Technical Patents", description: "Innovation pipeline" },
    { metric: "24/7", label: "Monitoring & Support", description: "Global coverage" }
  ];

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Technical <span className="text-blue-400">Advisors</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              World-renowned experts in AI, cloud architecture, and enterprise software engineering who guide our technical innovation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Technical Excellence */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Technical Excellence</h2>
            <p className="text-xl text-gray-300">
              Our technical advisors ensure Sales Centri maintains cutting-edge technology and enterprise-grade reliability
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {techStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.metric}</div>
                <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Advisors */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Technical Advisors</h2>
            <p className="text-xl text-gray-300">
              Industry leaders who have built the most advanced technical systems at the world&apos;s leading technology companies
            </p>
          </motion.div>

          <div className="space-y-8">
            {technicalAdvisors.map((advisor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
              >
                <div className="grid lg:grid-cols-4 gap-8">
                  {/* Profile Section */}
                  <div className="lg:col-span-1 text-center lg:text-left">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${advisor.color} flex items-center justify-center mx-auto lg:mx-0 mb-4`}>
                      <Code className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{advisor.name}</h3>
                    <div className="text-blue-400 font-semibold mb-2">{advisor.role}</div>
                    <div className="text-gray-400 text-sm mb-3">{advisor.company}</div>
                    <div className="text-gray-500 text-sm">{advisor.experience} experience</div>
                  </div>

                  {/* Details Section */}
                  <div className="lg:col-span-3">
                    <p className="text-gray-300 leading-relaxed mb-6">{advisor.background}</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3">Technical Expertise:</h4>
                        <div className="flex flex-wrap gap-2">
                          {advisor.expertise.map((skill, i) => (
                            <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-3">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {advisor.technologies.map((tech, i) => (
                            <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Key Achievements:</h4>
                      <div className="grid md:grid-cols-3 gap-3">
                        {advisor.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-400 text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4 mb-4">
                      <h4 className="text-green-400 font-semibold mb-2">Sales Centri Focus:</h4>
                      <p className="text-gray-300 text-sm">{advisor.focus}</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                      <p className="text-gray-300 text-sm italic">&quot;{advisor.quote}&quot;</p>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm">LinkedIn Profile</span>
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">Technical Contact</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Focus Areas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Technical Focus Areas</h2>
            <p className="text-xl text-gray-300">
              Our advisors guide development across critical technology domains that power Sales Centri
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <area.icon className={`w-12 h-12 ${area.color} mb-4`} />
                <h3 className="text-xl font-bold text-white mb-3">{area.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{area.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-white font-semibold text-sm mb-2">Key Technologies:</h4>
                  <div className="space-y-1">
                    {area.technologies.map((tech, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-gray-400 text-xs">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-300 text-xs leading-relaxed">{area.focus}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Pipeline */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Innovation Pipeline</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Our technical advisors help us stay ahead of the curve with cutting-edge research and development
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center"
            >
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">AI Research</h3>
              <p className="text-gray-300 leading-relaxed">
                Continuous advancement in natural language processing, conversational AI, and predictive analytics 
                to maintain our technological leadership.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center"
            >
              <Network className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Platform Evolution</h3>
              <p className="text-gray-300 leading-relaxed">
                Expanding platform capabilities with advanced integrations, real-time collaboration features, 
                and enhanced user experience design.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center"
            >
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Security Innovation</h3>
              <p className="text-gray-300 leading-relaxed">
                Pioneering new approaches to data privacy, security, and compliance that exceed 
                enterprise requirements and global standards.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Users className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Experience Enterprise-Grade AI Technology
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              See how our technical excellence, guided by world-class advisors, delivers unmatched performance and reliability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free Trial - Experience Our Technology
              </motion.button>
              <motion.button
                className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Request Technical Deep Dive
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  </>
  );
}
