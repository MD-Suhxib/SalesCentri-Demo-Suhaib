"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Briefcase, Users, Award, Heart, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

export default function InternOnJobTrainingProgram() {
  const { ref: sectionRef, inView: sectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const programBenefits = [
    {
      icon: Briefcase,
      title: "Hands-on Project Work",
      description: "Work on real community service projects that make a tangible difference while building your professional portfolio.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: GraduationCap,
      title: "Skill Development",
      description: "Develop in-demand skills in sales automation, lead generation, data analysis, and project management through practical experience.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Users,
      title: "Mentorship from Industry Experts",
      description: "Receive personalized guidance and mentorship from experienced professionals who are passionate about your growth and success.",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: Award,
      title: "Certification of Completion",
      description: "Earn a recognized certificate upon program completion that validates your skills and enhances your resume.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Heart,
      title: "Impact on Community Initiatives",
      description: "Contribute to meaningful community projects that create positive change while gaining valuable professional experience.",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black border-t border-b border-blue-500/10"
      aria-label="Intern On-Job Training Program"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={sectionInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-black border border-blue-500/20 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Student Development Program</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
            Intern On-Job Training{" "}
            <span className="text-blue-400">
              Program
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-4">
            Gain real-world experience while making a meaningful impact. Our internship program helps students develop professional skills through hands-on work on community service projects, guided by industry experts.
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Build your career foundation while contributing to initiatives that create positive change in communities worldwide.
          </p>
        </motion.header>

        {/* Program Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {programBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              className="bg-black border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div
                className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-500/20"
              >
                <benefit.icon className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Key Features List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-black border-2 border-blue-500/20 rounded-2xl p-8 md:p-10 mb-12"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
            What You&apos;ll Gain
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-relaxed">
                <strong className="text-white">Real Project Experience:</strong> Work on actual community service initiatives that create measurable impact
              </span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-relaxed">
                <strong className="text-white">Professional Skills:</strong> Master sales automation, lead generation, data analysis, and project management
              </span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-relaxed">
                <strong className="text-white">Expert Mentorship:</strong> Learn from industry leaders who guide your professional development
              </span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-relaxed">
                <strong className="text-white">Career Credentials:</strong> Earn a certificate that validates your skills and enhances your resume
              </span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-relaxed">
                <strong className="text-white">Community Impact:</strong> Contribute to meaningful projects that make a difference in people&apos;s lives
              </span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-relaxed">
                <strong className="text-white">Networking Opportunities:</strong> Connect with professionals, mentors, and fellow interns in the program
              </span>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center"
        >
          <div className="bg-black border border-blue-500/20 rounded-2xl p-8 md:p-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join our internship program and gain valuable experience while contributing to community service initiatives. Apply today to begin your professional development journey.
            </p>
            <Link href="/contact">
              <motion.button
                className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-10 py-5 rounded-xl font-semibold text-lg flex items-center space-x-2 hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300 mx-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Apply for Internship</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

