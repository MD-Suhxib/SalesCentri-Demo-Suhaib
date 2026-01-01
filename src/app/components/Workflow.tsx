'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Target, TrendingUp, DollarSign, Users, Settings, Sparkles, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Workflow = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Zap,
      title: "SalesGPT: AI-Powered Prospecting",
      description: "Leverage SalesGPT to instantly identify, qualify, and engage leads using advanced AI. Automate research, outreach, and follow-up for faster pipeline growth.",
      gradient: "from-blue-500 to-blue-600",
      size: "large",
      metrics: "< 2 hours",
      highlight: "AI First Contact"
    },
    {
      icon: Target,
      title: "Field-Tested Sales Frameworks",
      description: "Use our built-in workflows, lead scoring, and follow-up sequences to move deals forward with precision — no guesswork, just growth.",
      gradient: "from-blue-600 to-blue-700",
      size: "medium",
      metrics: "95% accuracy",
      highlight: "Proven Systems"
    },
    {
      icon: TrendingUp,
      title: "Performance at Scale",
      description: "From startups to enterprises, Sales Centri handles high-volume campaigns and complex journeys with ease — powered by automation and real-time analytics.",
      gradient: "from-blue-700 to-blue-800",
      size: "large",
      metrics: "10K+ leads/day",
      highlight: "Enterprise Ready"
    },
    {
      icon: DollarSign,
      title: "Lower Costs, Higher Conversions",
      description: "Say goodbye to bloated CRMs and siloed tools. With integrated AI tools, smart automation, and built-in communication, you&apos;ll save time and budget.",
      gradient: "from-blue-500 to-blue-600",
      size: "small",
      metrics: "60% cost reduction",
      highlight: "ROI Focused"
    },
    {
      icon: Users,
      title: "Human + AI = Stronger Selling",
      description: "Our intelligent systems don&apos;t replace your reps — they amplify them. From email automation to cloud calling, your team stays focused on closing.",
      gradient: "from-blue-600 to-blue-700",
      size: "medium",
      metrics: "3x productivity",
      highlight: "Team Amplification"
    },
    {
      icon: Settings,
      title: "Flexible, Modular, Yours",
      description: "Customize every workflow, integrate your stack, and adapt fast — whether you&apos;re running B2B outreach or building multi-touch campaigns.",
      gradient: "from-blue-700 to-blue-800",
      size: "large",
      metrics: "∞ customization",
      highlight: "Your Way"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".workflow-feature", {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".workflow-features",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 bg-black relative overflow-hidden px-4 md:px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-semibold text-sm tracking-wider uppercase mb-3 block">Workflow</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Streamlined <span className="text-blue-500">Sales Success</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From first contact to signed contract, our platform automates the heavy lifting so you can focus on closing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gray-900/20 border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-blue-400 text-xs font-medium px-2 py-1 bg-blue-500/10 rounded-lg">{feature.highlight}</span>
                <span className="text-gray-500 text-xs font-mono">{feature.metrics}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-gray-900/30 p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-blue-600/5" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Your End-to-End Journey</h3>
              <div className="space-y-8">
                {[
                  { title: "Identify", desc: "AI scouts verify leads instantly" },
                  { title: "Engage", desc: "Personalized multi-channel outreach" },
                  { title: "Convert", desc: "Automated follow-ups & scheduling" }
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{step.title}</h4>
                      <p className="text-gray-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <motion.a
                href="/solutions/psa-suite-one-stop-solution"
                className="inline-flex items-center gap-2 mt-8 text-white bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-medium transition-colors"
                whileHover={{ x: 5 }}
              >
                Start Automating <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {features.slice(3).map((feature, i) => (
                 <div key={i} className={`bg-black/40 border border-white/10 p-5 rounded-xl ${i === 2 ? 'col-span-2' : ''}`}>
                    <feature.icon className="w-6 h-6 text-gray-300 mb-3" />
                    <h4 className="text-white font-medium text-sm mb-1">{feature.title}</h4>
                    <p className="text-gray-500 text-xs">{feature.metrics}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
