'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis';
import { Search, Shield, Database, TrendingUp, ArrowRight, CheckCircle, Zap, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface PlatformCard {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: React.ElementType;
  link: string;
  imageUrl: string;
  color: string;
  features: string[];
  stats: { label: string; value: string }[];
}

export default function ContactIntelligenceDataPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const platformsRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const platforms: PlatformCard[] = [
    {
      id: 'ai-hunter',
      title: "AI Hunter",
      description: "Intelligent lead sourcing engine that finds, filters, and validates prospects using advanced AI algorithms.",
      longDescription: "Our AI Hunter platform revolutionizes lead generation by leveraging machine learning algorithms to identify high-quality prospects across multiple data sources. With real-time validation and intelligent filtering, you can focus on leads that convert.",
      icon: Search,
      color: "from-blue-500 to-blue-600",
      link: "/platforms/contact-intelligence/ai-hunter",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='hunter' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233B82F6'/%3E%3Cstop offset='100%25' style='stop-color:%232563EB'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23hunter)'/%3E%3Ccircle cx='200' cy='150' r='80' fill='none' stroke='white' stroke-width='3' opacity='0.3'/%3E%3Ccircle cx='200' cy='150' r='50' fill='white' opacity='0.2'/%3E%3Crect x='160' y='200' width='80' height='20' rx='10' fill='white' opacity='0.3'/%3E%3Ccircle cx='300' cy='80' r='25' fill='white' opacity='0.1'/%3E%3Ccircle cx='100' cy='220' r='18' fill='white' opacity='0.1'/%3E%3C/svg%3E",
      features: ["Advanced AI Algorithms", "Real-time Validation", "Multi-source Data", "Smart Filtering", "Bulk Processing"],
      stats: [
        { label: "Accuracy Rate", value: "95%" },
        { label: "Data Sources", value: "500+" },
        { label: "Daily Leads", value: "10K+" }
      ]
    },
    {
      id: 'contact-validator',
      title: "Contact Validator",
      description: "Real-time contact verification with 95% accuracy to reduce bounce rates and improve deliverability.",
      longDescription: "Ensure your email campaigns reach their destination with our advanced contact validation system. Using multiple verification layers and real-time checks, we guarantee the highest delivery rates in the industry.",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      link: "/platforms/contact-intelligence/hunter-validator",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='validator' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310B981'/%3E%3Cstop offset='100%25' style='stop-color:%23059669'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23validator)'/%3E%3Cpath d='M200 80 L260 130 L200 180 L140 130 Z' fill='white' opacity='0.2'/%3E%3Ccircle cx='200' cy='130' r='30' fill='white' opacity='0.3'/%3E%3Crect x='170' y='200' width='60' height='15' rx='7' fill='white' opacity='0.3'/%3E%3Ccircle cx='320' cy='90' r='15' fill='white' opacity='0.1'/%3E%3Ccircle cx='80' cy='210' r='12' fill='white' opacity='0.1'/%3E%3C/svg%3E",
      features: ["Real-time Verification", "Syntax Validation", "Domain Checking", "MX Record Validation", "Disposable Email Detection"],
      stats: [
        { label: "Validation Speed", value: "< 1s" },
        { label: "Accuracy Rate", value: "99.5%" },
        { label: "Bounce Reduction", value: "85%" }
      ]
    },
    {
      id: 'ai-aggregator',
      title: "AI Aggregator",
      description: "Comprehensive data aggregation platform that centralizes and enriches customer data from multiple sources.",
      longDescription: "Transform scattered data into actionable insights with our AI-powered aggregation platform. Seamlessly combine data from CRMs, social platforms, and public databases to create comprehensive customer profiles.",
      icon: Database,
      color: "from-blue-500 to-blue-600",
      link: "/platforms/contact-intelligence/ai-aggregator",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='aggregator' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238B5CF6'/%3E%3Cstop offset='100%25' style='stop-color:%237C3AED'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23aggregator)'/%3E%3Crect x='120' y='80' width='160' height='20' rx='10' fill='white' opacity='0.3'/%3E%3Crect x='120' y='120' width='160' height='20' rx='10' fill='white' opacity='0.2'/%3E%3Crect x='120' y='160' width='160' height='20' rx='10' fill='white' opacity='0.3'/%3E%3Crect x='120' y='200' width='160' height='20' rx='10' fill='white' opacity='0.2'/%3E%3Ccircle cx='340' cy='70' r='20' fill='white' opacity='0.1'/%3E%3Ccircle cx='60' cy='230' r='15' fill='white' opacity='0.1'/%3E%3C/svg%3E",
      features: ["Multi-source Integration", "Data Enrichment", "Real-time Sync", "Custom Fields", "API Access"],
      stats: [
        { label: "Data Sources", value: "200+" },
        { label: "Processing Speed", value: "1M+/hr" },
        { label: "Data Accuracy", value: "98%" }
      ]
    },
    {
      id: 'intellibase',
      title: "IntelliBase",
      description: "Advanced marketing intelligence platform that provides actionable insights and predictive analytics.",
      longDescription: "Unlock the power of predictive analytics with IntelliBase. Our advanced algorithms analyze customer behavior patterns, market trends, and engagement data to provide actionable insights that drive revenue growth.",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
      link: "/platforms/contact-intelligence/intellibase",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='intellibase' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2306B6D4'/%3E%3Cstop offset='100%25' style='stop-color:%230891B2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23intellibase)'/%3E%3Cpolyline points='80,200 120,160 160,180 200,120 240,140 280,80 320,100' fill='none' stroke='white' stroke-width='4' opacity='0.3'/%3E%3Ccircle cx='120' cy='160' r='8' fill='white' opacity='0.4'/%3E%3Ccircle cx='200' cy='120' r='8' fill='white' opacity='0.4'/%3E%3Ccircle cx='280' cy='80' r='8' fill='white' opacity='0.4'/%3E%3Crect x='60' y='220' width='280' height='20' rx='10' fill='white' opacity='0.2'/%3E%3C/svg%3E",
      features: ["Predictive Analytics", "Behavioral Insights", "Market Intelligence", "Custom Reports", "Real-time Dashboards"],
      stats: [
        { label: "Prediction Accuracy", value: "92%" },
        { label: "Data Points", value: "50M+" },
        { label: "Report Types", value: "100+" }
      ]
    }
  ];

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenisRef.current.on('scroll', () => {
      ScrollTrigger.update();
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Hero animations
      const heroTitle = heroRef.current?.querySelector('h1');
      const heroSubtitle = heroRef.current?.querySelector('p');
      
      if (heroTitle) {
        const splitTitle = new SplitType(heroTitle, { types: 'words,chars' });
        gsap.fromTo(splitTitle.chars, {
          y: 100,
          opacity: 0,
          rotationX: -90,
        }, {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.2,
          ease: 'back.out(1.7)',
          stagger: 0.02,
        });
      }

      if (heroSubtitle) {
        gsap.fromTo(heroSubtitle, {
          y: 50,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.5,
          ease: 'power2.out',
        });
      }

      // Platform cards animations
      const cards = document.querySelectorAll('.platform-card');
      cards.forEach((card) => {
        gsap.fromTo(card, {
          y: 100,
          opacity: 0,
          scale: 0.9,
        }, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        // Parallax effect for images
        const image = card.querySelector('.platform-image');
        if (image) {
          gsap.fromTo(image, {
            y: 50,
          }, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            }
          });
        }
      });

      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Contact Intelligence{' '}
              <span className="text-blue bg-blue !inline">
              &amp; Data Platforms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI-driven data intelligence to transform your lead generation, 
              contact validation, and customer insights with our comprehensive platform suite.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: Target, label: "Accuracy Rate", value: "99.5%" },
              { icon: Database, label: "Data Sources", value: "500+" },
              { icon: Zap, label: "Daily Processing", value: "10M+" },
              { icon: CheckCircle, label: "Validated Contacts", value: "1.2B+" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section ref={platformsRef} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-32">
            {platforms.map((platform, index) => (
              <div key={platform.id} className={`platform-card grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-xl flex items-center justify-center`}>
                      {React.createElement(platform.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <h2 className="text-4xl font-bold text-white">{platform.title}</h2>
                  </div>
                  
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {platform.longDescription}
                  </p>

                  {/* Features */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-4">Key Features:</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {platform.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-6">
                    {platform.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={platform.link}
                    className={`inline-flex items-center space-x-2 bg-gradient-to-r ${platform.color} text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 group`}
                  >
                    <span>Explore {platform.title}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 h-96">
                    <Image
                      src={platform.imageUrl}
                      alt={platform.title}
                      width={500}
                      height={400}
                      className="platform-image w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        html {
          scroll-behavior: auto !important;
        }
        
        body {
          overflow-x: hidden;
        }
        
        .platform-card {
          will-change: transform;
          transform: translateZ(0);
        }
        
        .platform-image {
          will-change: transform;
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
}