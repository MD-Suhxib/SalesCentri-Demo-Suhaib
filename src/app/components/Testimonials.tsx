"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Sales",
      company: "TechFlow Inc",
      content:
        "Sales Centri transformed our lead generation process. We're seeing 3x more qualified leads with half the manual work.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      name: "Marcus Rodriguez",
      role: "Founder",
      company: "GrowthLab",
      content:
        "The AI Hunter feature is incredible. It found prospects we never would have discovered manually, with 95% contact accuracy.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      name: "Emily Watson",
      role: "Sales Director",
      company: "ScaleUp Solutions",
      content:
        "SalesGPT handles our initial outreach perfectly. Our team can focus on closing deals instead of qualifying leads.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-black to-gray-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Sales Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how companies are transforming their sales process with
            Sales Centri
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                data-track="testimonial_click"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-blue-400 mb-4" />

                <p className="text-gray-300 leading-relaxed mb-6">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="flex items-center space-x-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
