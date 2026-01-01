'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Database,
  Brain,
  Target,
  Workflow,
  TrendingUp,
  BarChart3,
  Bot,
  Shield,
  Users,
  ArrowRight,
} from 'lucide-react';

export default function ILMSLeadManagementSystemPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-28 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-18 h-18 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
                  ILMS Lead Management System
                </h1>
              </div>
              <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto">
                Capture, qualify, route, and convert more leads with an AI-first lead management system. ILMS unifies
                every touchpoint, enriches data in real time, and automates workflows so your team focuses on closing.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: TrendingUp, label: 'Lift in SQLs', value: '+220%' },
                { icon: Brain, label: 'Score Accuracy', value: '94%' },
                { icon: Workflow, label: 'Tasks Automated', value: '85%' },
                { icon: Target, label: 'Response Time', value: '< 5 min' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <s.icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-gray-400 text-sm">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Pillars */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-16 px-6"
        >
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
            {[{
              title: 'AI Capture & Enrichment',
              desc: 'Ingest leads from forms, chat, email, CSV, and APIs. Validate, dedupe, and enrich profiles instantly.',
              icon: Target,
            }, {
              title: 'Smart Scoring & Prioritization',
              desc: 'Behavioral + firmographic models rank likelihood to buy and surface the next best action.',
              icon: Brain,
            }, {
              title: 'Automated Routing & Nurture',
              desc: 'Rules- and AI-driven assignment, SLAs, and multi-touch nurture journeys that adapt in real time.',
              icon: Workflow,
            }].map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 mb-5 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <b.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{b.title}</h3>
                <p className="text-gray-300">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Use cases */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="py-16 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
            {[{
              title: 'Sales Teams',
              desc: 'Fewer missed follow-ups, cleaner handoffs, and prioritized queues for each rep.',
              icon: Users,
              bullets: ['Qualified lead queues', 'Auto follow-up tasks', 'Owner re-assignment', 'Quota tracking'],
            }, {
              title: 'Marketing Ops',
              desc: 'True-source attribution, campaign ROI, and segment-based nurture automation.',
              icon: BarChart3,
              bullets: ['Attribution & ROI', 'Segment journeys', 'A/B testing', 'Lifecycle dashboards'],
            }].map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="bg-gray-800/40 rounded-xl p-8 border border-gray-700/40"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 mr-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <u.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{u.title}</h4>
                    <p className="text-gray-300">{u.desc}</p>
                  </div>
                </div>
                <ul className="grid grid-cols-2 gap-3">
                  {u.bullets.map((b) => (
                    <li key={b} className="flex items-center text-gray-400 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trust & Governance */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-16 px-6"
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[{
              title: 'Security First',
              desc: 'Role-based access, audit logs, and encryption keep customer data safe.',
              icon: Shield,
            }, {
              title: 'Compliance Ready',
              desc: 'Support for GDPR, SOC 2, ISO 27001, and data residency controls.',
              icon: Database,
            }, {
              title: 'Built to Scale',
              desc: 'Multi-region architecture, resilient queues, and zero-downtime deploys.',
              icon: Bot,
            }].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
              >
                <div className="w-12 h-12 mb-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <c.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-1">{c.title}</h3>
                <p className="text-gray-300 text-sm">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to modernize lead management?</h2>
            <p className="text-lg text-gray-300 mb-8">Launch SalesGPT with ILMS to qualify and route leads in real time.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/solutions/psa-suite-one-stop-solution"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 inline-flex items-center justify-center"
              >
                Try SalesGPT Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}


