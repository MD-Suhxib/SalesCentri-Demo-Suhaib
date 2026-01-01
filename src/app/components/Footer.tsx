"use client";

import { motion } from "framer-motion";
import { Twitter, Linkedin, Mail, Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SplitType from "split-type";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [email, setEmail] = useState("");
  const [isSubscribing] = useState(false);
  const [subscriptionStatus] = useState<"idle" | "success" | "error">("idle");

  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/solutions/psa-suite-one-stop-solution";
  };

  useEffect(() => {
    if (titleRef.current) {
      let splitText: any = null;
      let animation: any = null;

      try {
        splitText = new SplitType(titleRef.current, {
          types: "words,chars",
          tagName: "span",
        });

        // Set initial visibility to ensure text shows even if animation fails
        gsap.set(splitText.chars, {
          opacity: 1,
          y: 0,
          rotateX: 0,
        });

        // Simple animation without ScrollTrigger to avoid conflicts
        animation = gsap.fromTo(
          splitText.chars,
          {
            opacity: 0,
            y: 50,
            rotateX: -45,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.03,
            delay: 0.2,
          }
        );
      } catch (error) {
        console.warn("Footer animation failed:", error);
      }

      // Cleanup function
      return () => {
        try {
          if (animation) {
            animation.kill();
          }
          if (splitText && splitText.revert) {
            splitText.revert();
          }
        } catch (error) {
          // Silently ignore cleanup errors
        }
      };
    }
  }, []);
  const footerLinks = {
    Product: [
      { name: "Features", href: "/platforms/contact-intelligence" },
      { name: "ROI Calculator", href: "/roi-calculator" },
      { name: "Pricing", href: "/pricing" },
      { name: "Integrations", href: "/solutions/psa-suite-one-stop-solution" },
      { name: "API Documentation", href: "/docs/api-reference" },
      { name: "Security", href: "/trust-compliance" },
    ],
    Resources: [
      { name: "Blog", href: "/blog" },
      { name: "Case Studies", href: "/resources/case-studies" },
      { name: "Guides & Ebooks", href: "/resources/whitepapers-ebooks" },
      { name: "Community Engagement", href: "/company/community-engagement" },
      { name: "Webinars", href: "/resources/tutorials-webinars" },
      { name: "Startup Program", href: "/resources/startup-program" },
      { name: "Marketplace", href: "/market-place" },
      { name: "Performance Data", href: "/resources/performance-benchmarks" },
      { name: "FAQ", href: "/resources/faq" },
      { name: "User Guide", href: "/get-started/free-trial/support-resources" },
    ],
    Company: [
      { name: "About Us", href: "/company/about-us" },
      { name: "Careers", href: "/company/careers" },
      // { name: 'Team & Advisors', href: '/company/team-advisors' },
      // { name: 'Partners', href: '/company/partners-affiliates' },
      // { name: 'Press & News', href: '/company/press-news' },
      { name: "Privacy Policy", href: "/legal/privacy" },
    ],
    Support: [
      { name: "Contact Us", href: "/get-started/contact" },
      { name: "Get Started", href: "/get-started" },
      { name: "Book a Demo", href: "/get-started/book-demo" },
      { name: "Free Trial", href: "/get-started/free-trial" },
      { name: "Training", href: "/resources/tutorials-webinars" },
      { name: "Trust & Compliance", href: "/trust-compliance" },
    ],
  };

  return (
    <footer className="bg-black border-t border-gray-800 relative z-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-start mb-8 md:mb-12">
          {/* Left side - Large text */}
          <div className="lg:col-span-5">
            <h2
              ref={titleRef}
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight opacity-100"
              style={{ perspective: "1000px", visibility: "visible", display: "block" }}
            >
              <span style={{ opacity: 1, display: "inline" }}>Take Your</span>
              <br />
              <span style={{ opacity: 1, display: "inline" }}>Business To</span>
              <br />
              <span style={{ opacity: 1, display: "inline" }}>New Heights</span>
            </h2>

            {/* Contact Information */}
            <div className="space-y-3 md:space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2 text-sm md:text-base">
                  Contact Us
                </h4>
                <p className="text-gray-400 text-xs md:text-sm">
                  info@salescentri.com
                </p>
                <p className="text-gray-400 text-xs md:text-sm">
                  +1 415-754-4766
                </p>
              </div>

              {/* Addresses Side by Side */}
              <div className="grid md:grid-cols-2 gap-3 md:gap-5">
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm md:text-base">
                    Corporate Headquarters
                  </h4>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Sales Centri AI LLC
                    <br />
                    1309 Coffeen Avenue, STE 1200
                    <br />
                    Sheridan, Wyoming 82801
                    <br />
                    United States
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm md:text-base">
                    Registered Office
                  </h4>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Sales Centri AI LLC
                    <br />
                    1209 Orange Street,
                    <br />
                    Wilmington, Delaware 19801
                    <br />
                    County of New Castle
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Links */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="text-white font-semibold mb-3 md:mb-4 text-xs md:text-sm">
                    {category}
                  </h3>
                  <ul className="space-y-2 md:space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href}>
                          <motion.span
                            className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm cursor-pointer inline-block"
                            whileHover={{ x: 2 }}
                          >
                            {link.name}
                          </motion.span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter Signup Section */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for the latest updates and insights.
              </p>

              {subscriptionStatus === "success" && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm">
                    Successfully subscribed to our newsletter!
                  </p>
                </div>
              )}

              {subscriptionStatus === "error" && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">
                    Failed to subscribe. Please try again.
                  </p>
                </div>
              )}

              <form
                onSubmit={handleNewsletterSubscription}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubscribing}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <motion.button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isSubscribing ? { scale: 1.02 } : {}}
                  whileTap={!isSubscribing ? { scale: 0.98 } : {}}
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </motion.button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-4 pb-2 flex flex-col lg:flex-row justify-between items-start lg:items-center">
          {/* Logo and company name */}
          <motion.div
            className="flex items-center space-x-3 mb-6 lg:mb-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image
                src="/saleslogo.webp"
                alt="Sales Centri Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold leading-none">
              <span className="text-white">Sales</span>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent ml-1">Centri</span>
            </span>
          </motion.div>

          {/* Right side - Social links and credits */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            {/* Legal Links */}
            <div className="flex gap-6 text-sm">
              <Link href="/legal/terms">
                <motion.span
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  Terms of Service
                </motion.span>
              </Link>
              <Link href="/legal/privacy">
                <motion.span
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  Privacy Policy
                </motion.span>
              </Link>
              <Link href="/legal/cookies">
                <motion.span
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  Cookie Policy
                </motion.span>
              </Link>
            </div>

            {/* Social links */}
            <div className="flex space-x-3">
              {[
                {
                  Icon: Facebook,
                  href: "https://www.facebook.com/salescentri/",
                  name: "Facebook",
                },
                {
                  Icon: Twitter,
                  href: "https://x.com/salescentri",
                  name: "Twitter",
                },
                {
                  Icon: Linkedin,
                  href: "https://www.linkedin.com/company/salescentriai/",
                  name: "LinkedIn",
                },
                { Icon: Mail, href: "/contact", name: "Contact" },
              ].map(({ Icon, href, name }, index) => (
                <Link
                  key={index}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : "_self"}
                  data-track={`footer_${name.toLowerCase()}`}
                >
                  <motion.span
                    className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500/20 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.span>
                </Link>
              ))}

              {/* Custom social icons */}
              <Link
                href="http://quora.com/profile/salescentri"
                target="_blank"
                data-track="footer_quora"
              >
                <motion.span
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500/20 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src="/quora.webp"
                    alt="Quora"
                    width={16}
                    height={16}
                    className="object-contain filter grayscale brightness-400 hover:brightness-500 transition-all"
                  />
                </motion.span>
              </Link>

              <Link
                href="https://www.pinterest.com/salescentriai/"
                target="_blank"
                data-track="footer_pinterest"
              >
                <motion.span
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500/20 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src="/pinterest.webp"
                    alt="Pinterest"
                    width={16}
                    height={16}
                    className="object-contain filter grayscale brightness-400 hover:brightness-500 transition-all"
                  />
                </motion.span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 Sales Centri. All rights reserved.</p>
            <p>Developed at Sales Centri</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
