'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Image from 'next/image';
import Link from "next/link";
import { Zap, ArrowRight } from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface FeatureCard {
  id: string;
  number: string;
  title: string;
  description: string;
  icon?: React.ElementType;
  link: string;
  imageUrl: string;
  color: string;
  reversed?: boolean;
}

export const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features: FeatureCard[] = [
    {
      id: '01',
      number: '01',
      title: "Precision Engineered Sales Logic",
      description: "A powerful system that automates complex workflows with mechanical precision and intelligent self management.",
      color: "from-blue-500 to-blue-600",
      link: "/solutions/psa-suite-one-stop-solution",
      imageUrl: "/1.webp?v=3",
      reversed: false
    },
    {
      id: '02',
      number: '02',
      title: "Campaign and Research Dashboard",
      description: "A centralized command center to orchestrate campaigns, automate outreach, and generate leads with advanced AI research.",
      color: "from-indigo-500 to-purple-600",
      link: "https://dashboard.salescentri.com",
      imageUrl: "/2.webp?v=3",
      reversed: true
    },
    {
      id: '03',
      number: '03',
      title: "Intuitive User Interface",
      description: "Navigate faster with a user friendly design built specifically for high velocity sales productivity.",
      color: "from-blue-600 to-indigo-600",
      link: "https://dashboard.salescentri.com",
      imageUrl: "/3.webp?v=3",
      reversed: false
    },
    {
      id: '04',
      number: '04',
      title: "Automated Leads and Outreach",
      description: "Scale your prospecting with AI driven campaigns that find and engage verified leads automatically.",
      color: "from-sky-600 to-cyan-600",
      link: "https://dashboard.salescentri.com",
      imageUrl: "/4.webp?v=3",
      reversed: true
    }
  ];

  useEffect(() => {
    // Text animations with Split-Type
    const initTextAnimations = () => {
      // Animate main heading
      const heading = headerRef.current?.querySelector('h2');
      if (heading) {
        const splitHeading = new SplitType(heading, { types: 'words,chars' });
        
        gsap.fromTo(splitHeading.chars, {
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
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // Animate subtitle
      const subtitle = headerRef.current?.querySelector('p');
      if (subtitle) {
        const splitSubtitle = new SplitType(subtitle, { types: 'lines' });
        
        gsap.fromTo(splitSubtitle.lines, {
          y: 50,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          delay: 0.5,
          scrollTrigger: {
            trigger: subtitle,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // Animate card titles and descriptions
      const cards = document.querySelectorAll('.feature-card');
      cards.forEach((card) => {
        const title = card.querySelector('h3');
        const description = card.querySelector('.card-description');
        const number = card.querySelector('.card-number');

        if (title) {
          const splitTitle = new SplitType(title, { types: 'words' });
          
          gsap.fromTo(splitTitle.words, {
            y: 50,
            opacity: 0,
          }, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.05,
            scrollTrigger: {
              trigger: card,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          });
        }

        if (description) {
          gsap.fromTo(description, {
            y: 30,
            opacity: 0,
          }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: card,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          });
        }

        if (number) {
          gsap.fromTo(number, {
            opacity: 0,
          }, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      });
    };

    // Set up sticky card animations
    const setupStickyCards = () => {
      const cards = document.querySelectorAll('.sticky-card');
      
      cards.forEach((card, index) => {
        const cardElement = card as HTMLElement;
        
        // Initial setup
        gsap.set(cardElement, {
          zIndex: index + 1
        });

        // Card entrance animation - smooth appearance and landing
        gsap.fromTo(cardElement, {
          y: 100,
          opacity: 0,
          scale: 0.9
        }, {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardElement,
            start: 'top 100%',
            end: 'top 30%',
            scrub: 1.5,
            invalidateOnRefresh: true
          }
        });

        // Sticky behavior with GSAP - smoother transitions
        ScrollTrigger.create({
          trigger: cardElement,
          start: 'top 30%',
          end: () => index === cards.length - 1 ? `+=${window.innerHeight * 0.5}` : `+=${window.innerHeight * 1.5}`,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const nextCard = cards[index + 1] as HTMLElement;
            const isLastCard = index === cards.length - 1;
            
            // For the last card, create a smoother exit transition
            if (isLastCard && progress > 0.5) {
              const fadeProgress = Math.min(1, (progress - 0.5) / 0.5);
              const easedProgress = 1 - Math.pow(1 - fadeProgress, 2); // Quadratic ease-out
              const scale = 1 - (easedProgress * 0.1);
              const yOffset = -(easedProgress * 30);
              const opacity = 1 - (easedProgress * 0.6);
              
              gsap.set(cardElement, {
                scale: scale,
                y: yOffset,
                opacity: opacity,
                force3D: true
              });
            }
            // Smoother scaling and movement with easing for other cards
            else if (nextCard && progress > 0.7) {
              const scaleProgress = Math.min(1, (progress - 0.7) / 0.3);
              const easedProgress = 1 - Math.pow(1 - scaleProgress, 3); // Cubic ease-out
              const scale = 1 - (easedProgress * 0.05);
              const yOffset = -(easedProgress * 15);
              const opacity = 1 - (easedProgress * 0.3);
              
              gsap.set(cardElement, {
                scale: scale,
                y: yOffset,
                opacity: opacity,
                force3D: true
              });
            } else {
              gsap.set(cardElement, {
                scale: 1,
                y: 0,
                opacity: 1,
                force3D: true
              });
            }
          },
          onRefresh: () => {
            gsap.set(cardElement, {
              scale: 1,
              y: 0,
              opacity: 1,
              force3D: true
            });
          }
        });

        // Image parallax effect - smoother with better timing
        const imageContainer = cardElement.querySelector('.image-container');
        if (imageContainer) {
          gsap.to(imageContainer, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: cardElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
              refreshPriority: -1
            }
          });
        }
      });
    };

    // Delay to ensure DOM is ready and ScrollTrigger syncs with Lenis
    const timer = setTimeout(() => {
      initTextAnimations();
      setupStickyCards();
      
      // Refresh ScrollTrigger after setup to sync with Lenis
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen bg-black text-white pt-24 pb-32 px-4 md:px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-20 md:mb-32">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm mb-6">
            <Zap className="w-4 h-4 text-blue-400 fill-blue-400/20" />
            <span className="text-gray-300 text-sm font-medium">
              Platform Capabilities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Automate. Analyze. <span className="text-cyan-400">Accelerate.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Equip your team with a unified suite of intelligent tools designed to automate busywork, uncover deep insights, and drive revenue growth with precision.
          </p>
        </div>

        {/* Sticky Cards Section */}
        <div ref={cardsRef} className="relative">
          {features.map((feature, index) => {
            const isLast = index === features.length - 1;
            return (
              <div
                key={feature.id}
                className={`sticky-card feature-card sticky top-0 bg-[#0A0A0A] backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col lg:flex-row min-h-[60vh] md:min-h-[70vh] lg:min-h-[75vh] ${
                  feature.reversed ? 'lg:flex-row-reverse' : ''
                } ${isLast ? 'mb-8 md:mb-16' : 'mb-[40vh] md:mb-[60vh] lg:mb-[100vh]'}`}
                style={{ 
                  zIndex: index + 1,
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`
                }}
              >
                {/* Content Section - 40% */}
                <div className="lg:w-[40%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-[#111111]">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-[0.03]`} />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  
                  <div className="space-y-6 md:space-y-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <span className={`card-number text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br ${feature.color} opacity-50`}>
                        {feature.number}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="card-description text-base md:text-lg text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="pt-4">
                         <Link href={feature.link} className={`inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r ${feature.color} font-medium hover:opacity-80 transition-opacity cursor-pointer group`}>
                            <span className="mr-2">Learn more</span>
                            <ArrowRight className={`w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform`} />
                         </Link>
                    </div>
                  </div>
                </div>

                {/* Image Section - 60% */}
                <div className="w-full lg:w-[60%] relative image-container bg-[#050505] p-8 md:p-12 lg:p-16 flex items-center justify-center overflow-hidden lg:border-l border-white/5 min-h-[300px] md:min-h-[400px] lg:min-h-0">
                  {/* Decorative elements */}
                  <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${feature.color} opacity-10`} />
                  <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:radial-gradient(white,transparent)]" />
                  
                  {/* Image wrapper */}
                  <div className="relative w-full h-[300px] md:h-[400px] lg:h-full lg:max-h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-700 bg-black/50">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 z-10 mix-blend-overlay`} />
                    <Image
                      src={feature.imageUrl}
                      alt={feature.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        html {
          scroll-behavior: auto !important;
        }
        
        body {
          overflow-x: hidden;
        }
        
        .sticky-card {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          transition: none !important;
        }
        
        .image-container {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          transition: none !important;
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        * {
          scroll-behavior: auto !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};
