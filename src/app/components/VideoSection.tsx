"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Monitor, Target, Zap, Network, Atom } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Aurora } from "./Aurora";

export const VideoSection = () => {
  const [activeVideo, setActiveVideo] = useState("lightning-mode");
  const [forceVisible, setForceVisible] = useState(false);
  const [showAurora, setShowAurora] = useState(false);
  const bookingUrl = process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || "https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled";
  const router = useRouter();

  useEffect(() => {
    const checkHash = () => {
      if (typeof window !== "undefined" && window.location.hash === "#demo") {
        setForceVisible(true);
      }
    };
    
    // Check immediately
    checkHash();
    
    // Check after a short delay as fallback
    const timer = setTimeout(checkHash, 100);
    
    // Also check on hash change
    window.addEventListener('hashchange', checkHash);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  // Lazy load Aurora after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAurora(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Video sections data - Lightning Mode in center
  const videoSections = [
    {
      id: "focus-mode",
      title: "Focus Mode",
      description: "Experience distraction-free sales automation",
      icon: Target,
      videoSrc: "https://cdn.salescentri.com/focus-mode-demo-video-h264.mp4",
      poster: "/dashboard-img.png"
    },
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Comprehensive analytics and insights",
      icon: Monitor,
      videoSrc: "https://cdn.salescentri.com/dashboard-demo-video.mp4",
      poster: "/dashboard-img.png"
    },
    {
      id: "lightning-mode",
      title: "Lightning Mode",
      description: "Ultra-fast AI-powered research and insights",
      icon: Zap,
      videoSrc: "https://cdn.salescentri.com/lightning-mode-demo-video-h264.mp4",
      poster: "/dashboard-img.png"
    },
    {
      id: "multigpt",
      title: "MultiGPT",
      description: "Multi-source aggregated AI research",
      icon: Network,
      videoSrc: "https://cdn.salescentri.com/multi-gpt-demo-video-h264.mp4",
      poster: "/dashboard-img.png"
    },
    {
      id: "researchgpt",
      title: "ResearchGPT",
      description: "Deep dive AI research and analysis",
      icon: Atom,
      videoSrc: "https://cdn.salescentri.com/research-gpt-demo-video-h264.mp4",
      poster: "/dashboard-img.png"
    }
  ];

  // Navigation functions
  const goToPreviousVideo = () => {
    const currentIndex = videoSections.findIndex(section => section.id === activeVideo);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : videoSections.length - 1;
    setActiveVideo(videoSections[previousIndex].id);
  };

  const goToNextVideo = () => {
    const currentIndex = videoSections.findIndex(section => section.id === activeVideo);
    const nextIndex = currentIndex < videoSections.length - 1 ? currentIndex + 1 : 0;
    setActiveVideo(videoSections[nextIndex].id);
  };

  const handleVideoNavigate = () => {
    router.push(`/demo/${activeVideo}`);
  };

  // Split text animation for the video section heading
  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: index * 0.05,
          ease: [0.215, 0.61, 0.355, 1],
        }}
        className="inline-block"
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));
  };

  return (
    <section id="demo" className="video-section relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {showAurora && <Aurora />}

      {/* Animated background elements - reduced count and opacity */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-2xl"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.5, 0.2],
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

      <div className="relative max-w-6xl mx-auto">
        {/* Split Text Animated Heading */}
        <div className="text-center mb-8 lg:mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 whitespace-normal">
            <span className="md:hidden">
              <span className="inline-block">{splitText("See Sales Centri in ")}</span>
              <span className="inline-block">{splitText("Action")}</span>
            </span>
            <span className="hidden md:block">
              {splitText("See Sales Centri in Action")}
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={forceVisible ? { opacity: 1, y: 0 } : undefined}
            whileInView={forceVisible ? undefined : { opacity: 1, y: 0 }}
            viewport={forceVisible ? undefined : { once: true }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-xl text-gray-300 mt-2 max-w-3xl mx-auto"
          >
            Watch how our AI-powered platform transforms your sales process from
            lead generation to deal closure
          </motion.p>
        </div>

        {/* Video Section Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={forceVisible ? { opacity: 1, y: 0 } : undefined}
          whileInView={forceVisible ? undefined : { opacity: 1, y: 0 }}
          viewport={forceVisible ? undefined : { once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mb-6 md:mb-8 px-4"
        >
          {/* Modern Container - Grid layout on mobile, flex on desktop */}
          <div className="bg-black/80 backdrop-blur-sm border border-gray-800/50 rounded-3xl md:rounded-3xl p-2 md:p-1.5 w-full max-w-2xl md:max-w-none md:w-auto">
            {/* Mobile Grid Layout */}
            <div className="flex flex-col gap-2 md:hidden">
              <div className="grid grid-cols-3 gap-2">
                {videoSections.slice(0, 3).map((section, index) => {
                  const isActive = activeVideo === section.id;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveVideo(section.id)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 border ${
                        isActive
                          ? "bg-white text-black border-white shadow-md shadow-blue-500/20"
                          : "text-gray-300 border-white/10 bg-gray-900/60 hover:text-gray-100 hover:border-white/30"
                      }`}
                      whileHover={{ scale: isActive ? 1.02 : 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.08 }}
                    >
                      {section.title.split(" ")[0]}
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex justify-center gap-2">
                {videoSections.slice(3).map((section, index) => {
                  const isActive = activeVideo === section.id;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveVideo(section.id)}
                      className={`min-w-[110px] px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 border ${
                        isActive
                          ? "bg-white text-black border-white shadow-md shadow-blue-500/20"
                          : "text-gray-300 border-white/10 bg-gray-900/60 hover:text-gray-100 hover:border-white/30"
                      }`}
                      whileHover={{ scale: isActive ? 1.02 : 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.08 }}
                    >
                      {section.title.split(" ")[0]}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            {/* Desktop Flex Layout */}
            <div className="hidden md:flex items-center gap-3">
              {videoSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveVideo(section.id)}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-3xl text-sm font-small transition-all duration-200 whitespace-nowrap ${
                      activeVideo === section.id
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{section.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Video Container with External Navigation */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-12">
          {/* Left Arrow - Visible on large phones and up */}
          <motion.button
            onClick={goToPreviousVideo}
            className="flex flex-shrink-0 text-white hover:text-blue-400 active:text-blue-500 transition-all duration-200 cursor-pointer touch-manipulation"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={forceVisible ? { opacity: 1, y: 0, scale: 1 } : undefined}
            whileInView={forceVisible ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={forceVisible ? undefined : { once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex-1 px-2 sm:px-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            role="button"
            tabIndex={0}
            onClick={handleVideoNavigate}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleVideoNavigate();
              }
            }}
          >
            {/* Video with curved border and glow effect */}
            <div className="relative rounded-xl md:rounded-xl overflow-hidden border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 aspect-video">
              {/* Gradient border overlay */}
              <div className="absolute inset-0 rounded-1xl md:rounded-2xl bg-gradient-to-r from-blue-500/20 via-transparent to-cyan-500/20 p-[1px]">
                <div className="w-full h-full rounded-1xl md:rounded-2xl bg-black/80" />
              </div>

              {/* Video element */}
              <motion.video
                key={activeVideo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-full h-full object-cover rounded-1xl md:rounded-2xl"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={videoSections.find(section => section.id === activeVideo)?.poster}
              >
                <source 
                  src={videoSections.find(section => section.id === activeVideo)?.videoSrc} 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </motion.video>
            </div>

            {/* Glow effects */}
            <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-1xl md:rounded-2xl blur-xl md:blur-2xl opacity-30 -z-10" />
            <div className="absolute -inset-1 sm:-inset-2 md:-inset-2 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-1xl md:rounded-2xl blur-lg md:blur-xl opacity-50 -z-10" />
          </motion.div>

          {/* Right Arrow - Visible on large phones and up */}
          <motion.button
            onClick={goToNextVideo}
            className="flex flex-shrink-0 text-white hover:text-blue-400 active:text-blue-500 transition-all duration-200 cursor-pointer touch-manipulation"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Navigation Dots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex md:hidden justify-center mt-6 space-x-2"
        >
          {videoSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveVideo(section.id)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                activeVideo === section.id
                  ? "bg-blue-400 w-6"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </motion.div>

        {/* SalesGPT CTA below video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-6 md:mt-8 lg:mt-12"
        >
          <p className="text-gray-400 text-sm md:text-base lg:text-lg mb-4 md:mb-6 px-4">
            Experience the power of AI-driven sales automation
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/solutions/psa-suite-one-stop-solution">
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto text-sm cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                data-track="video_section_salesgpt"
              >
                <span>Talk to our SalesGPT</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </Link>
            <Link
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-500/30 text-blue-300 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 text-sm"
              prefetch={false}
              data-track="video_section_book_demo"
            >
              Book a demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
