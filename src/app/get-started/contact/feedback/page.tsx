'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, MessageSquare, Star, ThumbsUp, ThumbsDown, Lightbulb, Bug, Heart } from 'lucide-react';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    feedbackType: '',
    rating: 0,
    title: '',
    message: '',
    anonymous: false,
    followUp: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error' | null, message: string}>({
    type: null,
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Map form data to API format
      const apiData = {
        first_name: formData.anonymous ? 'Anonymous' : formData.firstName,
        last_name: formData.anonymous ? 'User' : formData.lastName,
        business_email: formData.anonymous ? 'anonymous@feedback.com' : formData.email,
        no_business_email: formData.anonymous,
        company: 'Feedback Submission',
        job_title: 'Feedback Provider',
        areas_of_interest: [
          formData.feedbackType,
          `Rating: ${formData.rating}/5`,
          formData.anonymous ? 'Anonymous Feedback' : 'Named Feedback',
          formData.followUp ? 'Open to follow-up' : 'No follow-up needed'
        ].filter(Boolean),
        additional_information: [
          `Title: ${formData.title}`,
          `Feedback Type: ${formData.feedbackType}`,
          `Message: ${formData.message}`,
          `Rating: ${formData.rating}/5 stars`
        ].filter(Boolean).join('\n\n')
      };

      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your feedback has been submitted successfully. We appreciate your input!'
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          feedbackType: '',
          rating: 0,
          title: '',
          message: '',
          anonymous: false,
          followUp: true
        });
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit feedback. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare },
    { value: 'feature-request', label: 'Feature Request', icon: Lightbulb },
    { value: 'bug-report', label: 'Bug Report', icon: Bug },
    { value: 'testimonial', label: 'Testimonial', icon: Heart },
    { value: 'improvement', label: 'Improvement Suggestion', icon: ThumbsUp },
    { value: 'complaint', label: 'Complaint', icon: ThumbsDown }
  ];

  const testimonials = [
    {
      quote: "Sales Centri has transformed our sales process. We've seen a 300% increase in qualified leads!",
      author: "Sarah Johnson",
      title: "Sales Director",
      company: "TechCorp"
    },
    {
      quote: "The AI-powered insights have helped us close deals faster and more efficiently.",
      author: "Michael Chen",
      title: "VP Sales",
      company: "GrowthCo"
    },
    {
      quote: "Best sales automation platform we've ever used. The support team is amazing!",
      author: "Emily Rodriguez",
      title: "Sales Manager",
      company: "ScaleUp Inc"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Share Your <span className="text-blue-400">Feedback</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Your feedback helps us improve Sales Centri. Share your thoughts, suggestions, or report issues to help us serve you better.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Feedback Type Selection */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-12 text-center">What type of feedback do you have?</h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbackTypes.map((type, index) => (
                  <motion.div
                    key={type.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    onClick={() => setFormData({ ...formData, feedbackType: type.value })}
                    className={`bg-gray-900/50 backdrop-blur-sm border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-500/50 ${
                      formData.feedbackType === type.value ? 'border-blue-500' : 'border-gray-700/50'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                      formData.feedbackType === type.value 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600' 
                        : 'bg-gray-700'
                    }`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{type.label}</h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Rating Section */}
        {formData.feedbackType && (
          <section className="pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-6">How would you rate your experience?</h2>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(star)}
                      className={`w-12 h-12 transition-all duration-300 ${
                        star <= formData.rating
                          ? 'text-yellow-400 hover:text-yellow-300'
                          : 'text-gray-600 hover:text-gray-500'
                      }`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
                <p className="text-gray-400">
                  {formData.rating === 0 && 'Click to rate your experience'}
                  {formData.rating === 1 && 'Poor - We\'d love to know how we can improve'}
                  {formData.rating === 2 && 'Fair - Please tell us what went wrong'}
                  {formData.rating === 3 && 'Good - What could we do better?'}
                  {formData.rating === 4 && 'Very Good - We\'re glad you\'re happy!'}
                  {formData.rating === 5 && 'Excellent - Thank you for the amazing feedback!'}
                </p>
              </motion.div>
            </div>
          </section>
        )}

        {/* Feedback Form */}
        {formData.feedbackType && (
          <section className="pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Tell us more</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!formData.anonymous && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your first name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {!formData.anonymous && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject/Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Brief title for your feedback"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Feedback *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        placeholder="Please share your detailed feedback..."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Submit feedback anonymously</span>
                    </label>
                    
                    {!formData.anonymous && (
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="followUp"
                          checked={formData.followUp}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-gray-300">I&apos;m open to follow-up discussions about this feedback</span>
                      </label>
                    )}
                  </div>

                  {/* Status Messages */}
                  {submitStatus.type && (
                    <div className={`p-4 rounded-lg border ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center flex-1 cursor-pointer ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        feedbackType: '',
                        rating: 0,
                        title: '',
                        message: '',
                        anonymous: false,
                        followUp: true
                      })}
                      className="border border-gray-600 text-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-12 text-center">What our customers are saying</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.author}</p>
                      <p className="text-gray-400 text-sm">{testimonial.title}</p>
                      <p className="text-blue-400 text-sm">{testimonial.company}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
