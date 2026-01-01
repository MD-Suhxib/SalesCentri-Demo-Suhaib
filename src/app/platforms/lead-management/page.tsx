'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Phone, 
  ArrowRight, 
  Globe, 
  Headphones, 
  Database,
  Search,
  TrendingUp,
  MessageSquare,
  Bot,
  Target
} from 'lucide-react';

export default function LeadManagementPage() {

  const productCategories = [
    {
      category: "Lead Management & Generation",
      products: [
        {
          id: 'iema',
          title: "iEMA (Email Marketing)",
          description: "Advanced email marketing automation for targeted campaigns.",
          longDescription: "Leverage our intelligent Email Marketing Automation to create, send, and track high-impact email campaigns. With features like audience segmentation, A/B testing, and detailed analytics, iEMA helps you nurture leads and drive conversions.",
          icon: MessageSquare,
          color: "from-blue-400 to-blue-500",
          link: "/platforms/lead-management/iema-email-marketing-automation",
          features: ["Audience Segmentation", "A/B Testing", "Drip Campaigns", "Analytics Dashboard"],
          stats: [
            { label: "Open Rate", value: "25%+" },
            { label: "Click Rate", value: "5%+" },
            { label: "Conversion Lift", value: "15%" }
          ]
        },
        {
          id: 'lead-generation',
          title: "Lead Generation",
          description: "AI-powered lead discovery and qualification.",
          longDescription: "Our AI-driven lead generation platform scours millions of data points to identify and qualify high-quality leads that match your ideal customer profile. Spend less time prospecting and more time closing deals.",
          icon: Search,
          color: "from-blue-500 to-blue-600",
          link: "/platforms/lead-management/lead-generation",
          features: ["AI Prospecting", "Ideal Customer Profile", "Data Enrichment", "Lead Scoring"],
          stats: [
            { label: "Lead Quality", value: "90%+" },
            { label: "Prospecting Time", value: "-80%" },
            { label: "Sales Pipeline", value: "+50%" }
          ]
        },
        {
          id: 'lead-stream',
          title: "Lead Stream",
          description: "Real-time stream of qualified leads delivered to your pipeline.",
          longDescription: "Lead Stream provides a continuous flow of verified, high-intent leads directly into your CRM. Our real-time data aggregation ensures you're always engaging with the freshest prospects.",
          icon: TrendingUp,
          color: "from-blue-600 to-blue-700",
          link: "/platforms/lead-management/lead-stream",
          features: ["Real-time Delivery", "Data Verification", "CRM Integration", "Custom Filters"],
          stats: [
            { label: "Lead Velocity", value: "24/7" },
            { label: "Data Accuracy", value: "98%" },
            { label: "Pipeline Growth", value: "30%" }
          ]
        },
        {
          id: 'ilms',
          title: "iLMS (Lead Management)",
          description: "Comprehensive lead management and sales automation.",
          longDescription: "Our integrated Lead Management System (iLMS) provides a centralized platform to track, manage, and automate your entire sales process. From lead capture to deal closure, iLMS streamlines your workflow and boosts productivity.",
          icon: Database,
          color: "from-blue-700 to-blue-800",
          link: "/platforms/lead-management/ilms",
          features: ["Pipeline Management", "Sales Automation", "Contact Management", "Reporting"],
          stats: [
            { label: "Sales Cycle", value: "-25%" },
            { label: "Productivity", value: "+40%" },
            { label: "Deal Closure", value: "+20%" }
          ]
        },
        {
          id: 'abm',
          title: "ABM (Account-Based Marketing)",
          description: "Targeted marketing for high-value accounts.",
          longDescription: "Our Account-Based Marketing platform helps you identify, target, and engage key accounts with personalized campaigns. Align your sales and marketing efforts to close bigger deals, faster.",
          icon: Target,
          color: "from-blue-800 to-blue-900",
          link: "/platforms/lead-management/abm",
          features: ["Account Identification", "Personalized Campaigns", "Cross-channel Outreach", "Engagement Analytics"],
          stats: [
            { label: "Deal Size", value: "+50%" },
            { label: "Account Engagement", value: "+70%" },
            { label: "Sales Alignment", value: "100%" }
          ]
        }
      ]
    },
    {
      category: "Voice AI & Dialer Solutions",
      products: [
        {
          id: 'dialer-ai',
          title: "DialerAI",
          description: "AI-powered predictive dialer for sales teams.",
          longDescription: "DialerAI uses advanced algorithms to predict agent availability and connect them with live prospects, dramatically increasing call volume and talk time. Boost your sales team's efficiency and reach.",
          icon: Phone,
          color: "from-blue-300 to-blue-400",
          link: "/platforms/lead-management/dialer-ai",
          features: ["Predictive Dialing", "Call Recording", "CRM Integration", "Real-time Analytics"],
          stats: [
            { label: "Talk Time", value: "+300%" },
            { label: "Call Volume", value: "+200%" },
            { label: "Agent Efficiency", value: "+150%" }
          ]
        },
        {
          id: 'sim-dialer',
          title: "SIM Dialer",
          description: "Mobile-first dialer for on-the-go sales reps.",
          longDescription: "Our SIM Dialer allows your sales team to make calls from their mobile devices while still benefiting from CRM integration, call tracking, and analytics. Perfect for remote and field sales.",
          icon: Phone,
          color: "from-blue-400 to-blue-500",
          link: "/platforms/lead-management/sim-dialer",
          features: ["Mobile Dialing", "CRM Sync", "Call Logging", "Performance Tracking"],
          stats: [
            { label: "Remote Productivity", value: "+60%" },
            { label: "Data Accuracy", value: "100%" },
            { label: "Call Connectivity", value: "99.9%" }
          ]
        },
        {
          id: 'sales-ai-agent',
          title: "SalesAI Agent",
          description: "AI-powered sales agent for lead qualification and follow-up.",
          longDescription: "SalesAI Agent is an intelligent virtual assistant that engages leads, answers questions, and schedules meetings, freeing up your sales team to focus on closing deals. Available 24/7.",
          icon: Bot,
          color: "from-blue-500 to-blue-600",
          link: "/platforms/lead-management/salesai-agent",
          features: ["24/7 Lead Engagement", "Appointment Scheduling", "CRM Integration", "Natural Language Processing"],
          stats: [
            { label: "Lead Response Time", value: "< 1 min" },
            { label: "Meetings Booked", value: "+45%" },
            { label: "Sales Rep Time Saved", value: "10+ hrs/wk" }
          ]
        },
        {
          id: 'voice-ai-agent',
          title: "VoiceAI Agent",
          description: "Conversational voice AI for customer service and support.",
          longDescription: "Our VoiceAI Agent handles inbound and outbound calls with natural, human-like conversation. Automate routine customer interactions, provide 24/7 support, and reduce operational costs.",
          icon: Bot,
          color: "from-blue-600 to-blue-700",
          link: "/platforms/lead-management/voice-ai-agent",
          features: ["Natural Conversation", "24/7 Availability", "Omnichannel Support", "Sentiment Analysis"],
          stats: [
            { label: "Cost Reduction", value: "-60%" },
            { label: "Customer Satisfaction", value: "+30%" },
            { label: "Call Resolution Rate", value: "85%" }
          ]
        },
        {
          id: 'voice-bot',
          title: "Voice Bot",
          description: "Advanced voice automation for customer interactions.",
          longDescription: "Deploy intelligent voice bots that can handle complex customer conversations, provide support, and route calls efficiently. Built with natural language understanding and human-like responses.",
          icon: Bot,
          color: "from-blue-700 to-blue-800",
          link: "/platforms/lead-management/voice-bot",
          features: ["Natural Language Processing", "Call Routing", "Multi-language Support", "Integration Ready"],
          stats: [
            { label: "Call Handling", value: "24/7" },
            { label: "Response Accuracy", value: "95%" },
            { label: "Cost Savings", value: "70%" }
          ]
        },
        {
          id: 'sales-tune',
          title: "Sales Tune",
          description: "Performance optimization platform for sales teams.",
          longDescription: "Sales Tune analyzes your sales team's performance and provides actionable insights to improve conversion rates, optimize workflows, and accelerate deal closure.",
          icon: TrendingUp,
          color: "from-blue-800 to-blue-900",
          link: "/platforms/lead-management/sales-tune",
          features: ["Performance Analytics", "Workflow Optimization", "Team Coaching", "ROI Tracking"],
          stats: [
            { label: "Conversion Rate", value: "+35%" },
            { label: "Deal Velocity", value: "+25%" },
            { label: "Team Performance", value: "+40%" }
          ]
        }
      ]
    },
    {
      category: "Chat & Text AI Automation",
      products: [
        {
          id: 'chat-bot',
          title: "Chat Bot",
          description: "Intelligent chatbots for websites and applications.",
          longDescription: "Deploy smart chatbots to engage website visitors, answer questions, and capture leads 24/7. Our no-code builder makes it easy to create and customize bots for any use case.",
          icon: Bot,
          color: "from-blue-300 to-blue-400",
          link: "/platforms/lead-management/chat-bot",
          features: ["No-Code Builder", "Lead Capture", "24/7 Support", "CRM Integration"],
          stats: [
            { label: "Leads Captured", value: "+50%" },
            { label: "Support Tickets", value: "-70%" },
            { label: "Visitor Engagement", value: "+80%" }
          ]
        },
        {
          id: 'whatsapp-bot',
          title: "WhatsApp Bot",
          description: "Automated conversations on the world's most popular messaging app.",
          longDescription: "Engage your customers on WhatsApp with our intelligent bot. Send notifications, provide support, and run marketing campaigns on the platform your customers prefer.",
          icon: MessageSquare,
          color: "from-blue-400 to-blue-500",
          link: "/platforms/lead-management/whatsapp-bot",
          features: ["Marketing Campaigns", "Customer Support", "Notifications", "Rich Media"],
          stats: [
            { label: "Open Rate", value: "98%" },
            { label: "Engagement", value: "+150%" },
            { label: "Conversion Rate", value: "+30%" }
          ]
        },
        {
          id: 'text-to-speech',
          title: "Text to Speech",
          description: "Convert text into natural-sounding speech.",
          longDescription: "Our advanced Text to Speech engine creates high-quality, human-like voiceovers for your videos, presentations, and applications. Choose from a wide range of languages and voices.",
          icon: Bot,
          color: "from-blue-500 to-blue-600",
          link: "/platforms/lead-management/text-to-speech",
          features: ["Multiple Languages", "Natural Voices", "SSML Support", "API Access"],
          stats: [
            { label: "Languages", value: "50+" },
            { label: "Voices", value: "200+" },
            { label: "Audio Quality", value: "Studio-grade" }
          ]
        },
        {
          id: 'speech-to-text',
          title: "Speech to Text",
          description: "Accurate transcription of audio and video files.",
          longDescription: "Our Speech to Text service uses deep learning to provide fast and accurate transcriptions of your audio and video content. Ideal for call analysis, content creation, and accessibility.",
          icon: Bot,
          color: "from-blue-600 to-blue-700",
          link: "/platforms/lead-management/speech-to-text",
          features: ["High Accuracy", "Real-time Transcription", "Speaker Diarization", "API Access"],
          stats: [
            { label: "Accuracy", value: "95%+" },
            { label: "Turnaround Time", value: "Real-time" },
            { label: "Cost Savings", value: "-80%" }
          ]
        }
      ]
    },
    {
      category: "Cloud Telephony & Infrastructure",
      products: [
        {
          id: 'igct',
          title: "iGCT (Integrated Global Communication Technology)",
          description: "Enterprise-grade unified communications platform.",
          longDescription: "Connect your global workforce with our integrated communication technology platform. Combine voice, video, messaging, and collaboration tools in one seamless solution designed for enterprise scale.",
          icon: Globe,
          color: "from-blue-700 to-blue-800",
          link: "/platforms/lead-management/igct",
          features: ["Global Network", "Unified Communications", "Video Conferencing", "Team Collaboration"],
          stats: [
            { label: "Global Reach", value: "180+ Countries" },
            { label: "Uptime", value: "99.9%" },
            { label: "Concurrent Users", value: "100K+" }
          ]
        },
        {
          id: 'call-center',
          title: "Call Center Solutions",
          description: "Complete cloud-based call center platform.",
          longDescription: "Transform your customer service operations with our comprehensive cloud call center solution. Features include intelligent call routing, real-time monitoring, advanced analytics, and seamless CRM integrations.",
          icon: Headphones,
          color: "from-blue-800 to-blue-900",
          link: "/platforms/lead-management/call-center",
          features: ["Intelligent Routing", "Real-time Monitoring", "Analytics", "CRM Integration"],
          stats: [
            { label: "Call Resolution", value: "95%" },
            { label: "Hold Time", value: "< 30s" },
            { label: "Productivity", value: "+40%" }
          ]
        }
      ]
    }
  ];

  // Platform features for future use
  // const platformFeatures = [
  //   {
  //     icon: Cloud,
  //     title: "Unified Platform",
  //     description: "A single, integrated platform for all your sales and marketing needs."
  //   },
  //   {
  //     icon: Shield,
  //     title: "Enterprise Security",
  //     description: "Robust security features to protect your data and communications."
  //   },
  //   {
  //     icon: Zap,
  //     title: "High Performance",
  //     description: "Built for speed and reliability to ensure you never miss an opportunity."
  //   },
  //   {
  //     icon: Settings,
  //     title: "Easy Integration",
  //     description: "Seamlessly connect with your existing tools and workflows."
  //   }
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Lead Management Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              The Complete
              <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent"> Sales & Marketing</span> OS
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              One integrated platform to manage your entire lead lifecycle, from generation to conversion and beyond.
            </p>
          </motion.div>
        </div>
      </section>
      
      {productCategories.map((category, catIndex) => (
        <section key={catIndex} className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">{category.category}</h2>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {category.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group backdrop-blur-sm"
                >
                  <div className="p-8">
                    <div className={`w-12 h-12 bg-gradient-to-br ${product.color} rounded-lg flex items-center justify-center mb-4`}>
                      <product.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{product.title}</h3>
                    <p className="text-gray-300 mb-6">{product.longDescription}</p>
                    
                    <Link
                      href={product.link}
                      className={`w-full bg-gradient-to-r ${product.color} text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group`}
                    >
                      Explore {product.title}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
