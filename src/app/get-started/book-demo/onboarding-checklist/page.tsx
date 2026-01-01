'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Circle, Clock, Target, Settings, BookOpen } from 'lucide-react';

export default function OnboardingChecklistPage() {
  const [completedItems, setCompletedItems] = useState(new Set());

  const toggleItem = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const checklistSections = [
    {
      title: 'Pre-Demo Preparation',
      icon: BookOpen,
      timeframe: 'Before your demo',
      color: 'from-blue-500 to-cyan-600',
      items: [
        {
          id: 'goals',
          title: 'Define Your Goals',
          description: 'Identify what you want to achieve with sales automation',
          estimated: '10 minutes'
        },
        {
          id: 'team-size',
          title: 'Determine Team Size',
          description: 'Know how many team members will use the platform',
          estimated: '5 minutes'
        },
        {
          id: 'current-tools',
          title: 'List Current Tools',
          description: 'Document your existing CRM, email tools, and integrations',
          estimated: '15 minutes'
        },
        {
          id: 'pain-points',
          title: 'Document Pain Points',
          description: 'Note current challenges in your sales process',
          estimated: '10 minutes'
        }
      ]
    },
    {
      title: 'Demo Day Setup',
      icon: Settings,
      timeframe: 'Day of demo',
      color: 'from-cyan-500 to-blue-600',
      items: [
        {
          id: 'tech-check',
          title: 'Technical Check',
          description: 'Test your internet, microphone, and screen sharing',
          estimated: '5 minutes'
        },
        {
          id: 'stakeholders',
          title: 'Gather Stakeholders',
          description: 'Ensure decision-makers can attend the demo',
          estimated: '30 minutes'
        },
        {
          id: 'questions',
          title: 'Prepare Questions',
          description: 'Write down specific questions about features and pricing',
          estimated: '10 minutes'
        },
        {
          id: 'data-sample',
          title: 'Prepare Sample Data',
          description: 'Have sample contacts or leads ready for demonstration',
          estimated: '15 minutes'
        }
      ]
    },
    {
      title: 'Post-Demo Actions',
      icon: Target,
      timeframe: 'After your demo',
      color: 'from-blue-600 to-indigo-600',
      items: [
        {
          id: 'requirements',
          title: 'Document Requirements',
          description: 'List must-have features and integration needs',
          estimated: '20 minutes'
        },
        {
          id: 'timeline',
          title: 'Set Implementation Timeline',
          description: 'Plan when you want to start using the platform',
          estimated: '10 minutes'
        },
        {
          id: 'budget',
          title: 'Confirm Budget',
          description: 'Ensure pricing aligns with your budget expectations',
          estimated: '15 minutes'
        },
        {
          id: 'trial-plan',
          title: 'Plan Free Trial',
          description: 'Decide what to test during your trial period',
          estimated: '15 minutes'
        }
      ]
    }
  ];

  const totalItems = checklistSections.reduce((sum, section) => sum + section.items.length, 0);
  const completedCount = completedItems.size;
  const progressPercentage = (completedCount / totalItems) * 100;

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Demo <span className="text-blue-400">Preparation Checklist</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Maximize the value of your Sales Centri demo with our comprehensive preparation checklist. Get the most out of your time with our experts.
              </p>
              
              {/* Progress Bar */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-semibold">Progress</span>
                  <span className="text-blue-400 font-semibold">{completedCount}/{totalItems}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2">{Math.round(progressPercentage)}% complete</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Checklist Sections */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {checklistSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * sectionIndex }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className={`bg-gradient-to-r ${section.color} p-3 rounded-xl`}>
                    <section.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                    <p className="text-blue-400">{section.timeframe}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * itemIndex }}
                      className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                        completedItems.has(item.id)
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : 'bg-gray-800/50 border-gray-700/50 hover:border-blue-500/30'
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="flex items-start gap-4">
                        <button className="mt-1">
                          {completedItems.has(item.id) ? (
                            <CheckCircle className="w-6 h-6 text-blue-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-500 hover:text-blue-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-xl font-semibold ${
                              completedItems.has(item.id) ? 'text-blue-400' : 'text-white'
                            }`}>
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-1 text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{item.estimated}</span>
                            </div>
                          </div>
                          <p className="text-gray-300">{item.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-cyan-700/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready for Your Demo?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Complete your preparation and book your personalized Sales Centri demonstration
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started/book-demo" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105">
                  Book Your Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/get-started/free-trial" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300">
                  Start Free Trial Instead
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
