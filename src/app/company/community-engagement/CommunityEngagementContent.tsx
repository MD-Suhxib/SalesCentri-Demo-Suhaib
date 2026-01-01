"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Heart, TrendingUp, Lightbulb, Handshake, Globe, Rocket, Accessibility, GraduationCap, Briefcase, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import InternOnJobTrainingProgram from "@/app/components/InternOnJobTrainingProgram";

export default function CommunityEngagementContent() {
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: introRef, inView: introInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: pillarsRef, inView: pillarsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: impactRef, inView: impactInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: cardsRef, inView: cardsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: ctaRef, inView: ctaInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: csrRef, inView: csrInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const commitmentPillars = [
    {
      icon: Users,
      title: "Empowering Sales Teams",
      description: "We provide free resources, training, and tools to help sales professionals excel in their careers and drive meaningful business outcomes.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Lightbulb,
      title: "Innovation & Education",
      description: "Through webinars, workshops, and thought leadership, we share insights that help businesses transform their sales operations.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Handshake,
      title: "Partnership & Collaboration",
      description: "We build lasting relationships with customers, partners, and communities to create a thriving ecosystem of sales excellence.",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Our commitment extends beyond borders, supporting sales professionals and businesses worldwide with accessible, powerful tools.",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const impactInitiatives = [
    {
      title: "Sales Education Program",
      description: "Free training modules and certifications for sales professionals looking to enhance their skills with AI-powered tools.",
      metric: "10,000+",
      metricLabel: "Professionals Trained",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    },
    {
      title: "Startup Support Initiative",
      description: "Providing discounted access and mentorship to early-stage startups, helping them scale their sales operations efficiently.",
      metric: "500+",
      metricLabel: "Startups Supported",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    },
    {
      title: "Community Forums",
      description: "Active online communities where sales professionals share best practices, tips, and success stories.",
      metric: "25,000+",
      metricLabel: "Active Members",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    },
  ];

  const featureCards = [
    {
      title: "Free Webinars & Workshops",
      description: "Monthly educational sessions covering automation, lead generation, and sales strategy best practices.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      link: "/resources/tutorials-webinars",
    },
    {
      title: "Open Source Contributions",
      description: "Supporting the developer community with open-source tools and integrations that enhance sales workflows.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
      link: "/docs/integrations",
    },
    {
      title: "Customer Success Stories",
      description: "Showcasing how businesses achieve remarkable results using Sales Centri to transform their sales processes.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      link: "/resources/case-studies",
    },
    {
      title: "Sales Community Events",
      description: "Hosting meetups, conferences, and networking events that bring together sales professionals and thought leaders.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
      link: "/company/press-news",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Animated Background - Very subtle blue accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-label="Hero section">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-black border border-blue-500/20 rounded-full px-4 py-2"
              >
                <Heart className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Community Engagement</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
                Empowering Sales Teams{" "}
                <span className="text-blue-400">
                  Worldwide
                </span>
              </h1>

              <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                At Sales Centri, we believe in giving back to the sales community. Through education, partnerships, and innovation, we're building a future where every sales professional can achieve extraordinary results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/contact">
                  <motion.button
                    className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/resources/tutorials-webinars">
                  <motion.button
                    className="border border-blue-500/20 text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/5 hover:border-blue-400/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Resources
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop"
                alt="Diverse sales team collaborating on business strategy and community engagement initiatives"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section ref={introRef} className="py-20 px-4 sm:px-6 lg:px-8 relative" aria-label="Introduction">
        <div className="max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Building a <span className="text-blue-400">Stronger Sales Community</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
              Our commitment to community engagement goes beyond our products. We invest in education, support innovation, and foster collaboration to help sales professionals and businesses succeed in an increasingly competitive marketplace.
            </p>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
              Through strategic partnerships, free resources, and active participation in the sales ecosystem, we're creating lasting impact that extends far beyond our platform.
            </p>
          </motion.article>
        </div>
      </section>

      {/* CSR Initiatives Section - Moved Higher for Prominence */}
      <section ref={csrRef} className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black border-t border-b border-blue-500/10" aria-label="Corporate Social Responsibility Initiatives">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={csrInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={csrInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-black border border-blue-500/20 rounded-full px-4 py-2 mb-6"
            >
              <Heart className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Corporate Social Responsibility</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              Our <span className="text-blue-400">CSR Initiatives</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Sales Centri actively engages with diverse communities, empowering individuals through employment opportunities and comprehensive training programs. We connect with rural areas to bridge the digital divide and create meaningful career opportunities.
            </p>
          </motion.header>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            {/* Empowering Women */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={csrInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-black border-2 border-pink-500/20 rounded-2xl p-5 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-pink-500/20">
                <Sparkles className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-pink-300 transition-colors">Empowering Women</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                Sales Centri is committed to empowering women in the workforce by providing equal employment opportunities, mentorship programs, and specialized training to help women excel in sales and technology roles.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <GraduationCap className="w-4 h-4 text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Professional development and skill-building workshops</span>
                </li>
                <li className="flex items-start">
                  <Briefcase className="w-4 h-4 text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Leadership and career advancement programs</span>
                </li>
                <li className="flex items-start">
                  <Users className="w-4 h-4 text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Mentorship and networking opportunities</span>
                </li>
              </ul>
            </motion.div>

            {/* Empowering Differently Abled People */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={csrInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black border-2 border-blue-500/20 rounded-2xl p-5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-500/20">
                <Accessibility className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">Empowering Differently Abled People</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                We provide employment opportunities and comprehensive training programs designed to support differently abled individuals in building successful careers in sales and technology.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <Briefcase className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Inclusive employment opportunities across departments</span>
                </li>
                <li className="flex items-start">
                  <GraduationCap className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Specialized training programs tailored to individual needs</span>
                </li>
                <li className="flex items-start">
                  <Heart className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Accessible workplace and technology accommodations</span>
                </li>
              </ul>
            </motion.div>

            {/* Neurodivergent Talent Empowerment Program */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={csrInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-black border-2 border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-cyan-500/20">
                <Rocket className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">Neurodivergent Talent Empowerment Program</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                Sales Centri is committed to supporting neurodivergent professionals by offering structured guidance, inclusive workflows, and tailored skill-building opportunities. Our program helps individuals strengthen their capabilities in sales automation and technology within an environment designed for their success.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <Lightbulb className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Inclusive workplace standards and workflows</span>
                </li>
                <li className="flex items-start">
                  <GraduationCap className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Role-specific training tailored to individual capabilities</span>
                </li>
                <li className="flex items-start">
                  <Handshake className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ongoing support and mentorship for career growth</span>
                </li>
              </ul>
            </motion.div>

            {/* Rural Areas Connection */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={csrInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black border-2 border-emerald-500/20 rounded-2xl p-5 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-emerald-500/20">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-300 transition-colors">Connecting Rural Areas</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                Sales Centri connects with rural communities to bridge the digital divide, providing remote employment opportunities, digital skills training, and technology access to empower individuals in underserved areas.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Remote employment opportunities for rural talent</span>
                </li>
                <li className="flex items-start">
                  <GraduationCap className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Digital literacy and technology training programs</span>
                </li>
                <li className="flex items-start">
                  <Globe className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Bridging the digital divide through accessible technology</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={csrInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 bg-black border-2 border-blue-500/20 rounded-2xl p-6 text-center"
          >
            <Heart className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <p className="text-base text-gray-400 leading-relaxed max-w-4xl mx-auto font-medium">
              At Sales Centri, we believe that diversity and inclusion drive innovation. Our CSR initiatives reflect our commitment to creating equal opportunities, providing employment, and delivering comprehensive training that empowers individuals from all communities—including women, differently abled people, individuals with autism, and rural areas—to achieve their professional goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intern On-Job Training Program */}
      <InternOnJobTrainingProgram />

      {/* Commitment Pillars */}
      <section ref={pillarsRef} className="py-20 px-4 sm:px-6 lg:px-8 relative" aria-label="Commitment Pillars">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
              Our <span className="text-blue-400">Commitment Pillars</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Four core principles guide our community engagement efforts
            </p>
          </motion.header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {commitmentPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <pillar.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{pillar.title}</h3>
                <p className="text-gray-400 leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Showcase */}
      <section ref={impactRef} className="py-20 px-4 sm:px-6 lg:px-8 relative bg-black" aria-label="Impact Initiatives">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={impactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
              Making a <span className="text-blue-400">Measurable Impact</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Our initiatives are creating real value for the sales community
            </p>
          </motion.header>

          <div className="grid md:grid-cols-3 gap-8">
            {impactInitiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 30 }}
                animate={impactInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-black border border-blue-500/20 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={initiative.image}
                    alt={`${initiative.title} - ${initiative.description}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{initiative.title}</h3>
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-gray-400 mb-6 leading-relaxed">{initiative.description}</p>
                  <div className="pt-6 border-t border-blue-500/10">
                    <div className="text-3xl font-bold text-blue-400 mb-1">{initiative.metric}</div>
                    <div className="text-sm text-gray-400">{initiative.metricLabel}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Cards Section */}
      <section ref={cardsRef} className="py-20 px-4 sm:px-6 lg:px-8 relative" aria-label="Community Engagement Programs">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={cardsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
              Ways We <span className="text-blue-400">Engage</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Discover the various programs and resources we offer to support the sales community
            </p>
          </motion.header>

          <div className="grid md:grid-cols-2 gap-8">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={card.link}>
                  <div className="bg-black border border-blue-500/20 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={card.image}
                        alt={`${card.title} - ${card.description}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed mb-6 flex-1">{card.description}</p>
                      <div className="flex items-center text-blue-400 font-semibold group-hover:gap-2 transition-all">
                        <span>Learn More</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={ctaRef} className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6">
              <Rocket className="w-10 h-10 text-blue-400" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Ready to <span className="text-blue-400">Join Our Community?</span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Whether you're looking to enhance your sales skills, connect with peers, or explore how Sales Centri can transform your business, we're here to help you succeed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/contact">
                  <motion.button
                    className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-10 py-5 rounded-xl font-semibold text-lg flex items-center space-x-2 hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button
                    className="border-2 border-blue-500/20 text-blue-400 px-10 py-5 rounded-xl font-semibold text-lg hover:bg-blue-500/5 hover:border-blue-400/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Our Team
                  </motion.button>
              </Link>
            </div>

            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
                <div className="text-sm text-gray-400">Professionals Trained</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-sm text-gray-400">Startups Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">25K+</div>
                <div className="text-sm text-gray-400">Community Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">100+</div>
                <div className="text-sm text-gray-400">Events Hosted</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

