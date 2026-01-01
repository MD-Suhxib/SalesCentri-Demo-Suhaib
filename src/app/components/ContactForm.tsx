"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { CaptchaOTP } from "./CaptchaOTP";

export const ContactForm = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showSalesGPTModal, setShowSalesGPTModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    linkedinUrl: "",
    company: "",
    jobTitle: "",
    reason: "",
    teamSize: "",
    areasOfInterest: [] as string[],
    message: "",
    usePersonalEmail: false,
  });
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for email validation errors
    if (emailError) {
      return;
    }

    // Check for captcha verification
    if (!captchaVerified) {
      setSubmitStatus({
        type: "error",
        message: "Please complete captcha verification before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Map form data to API format
      const apiData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        business_email: formData.email,
        no_business_email: formData.usePersonalEmail,
        linkedin_profile: formData.linkedinUrl || undefined,
        company: formData.company,
        job_title: formData.jobTitle,
        sales_team_size: formData.teamSize || undefined,
        areas_of_interest: formData.areasOfInterest,
        additional_information: formData.message || undefined,
      };

      const response = await fetch("/api/contact-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Thank you! Your demo request has been submitted successfully. We'll get back to you soon.",
        });
        setShowSalesGPTModal(true);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          linkedinUrl: "",
          company: "",
          jobTitle: "",
          reason: "",
          teamSize: "",
          areasOfInterest: [],
          message: "",
          usePersonalEmail: false,
        });
        setEmailError("");
      } else {
        throw new Error(result.error || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Failed to submit form. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Field interaction tracking removed (external tracker handles clicks/form submits)

    // Email validation
    if (name === "email") {
      validateEmail(value, formData.usePersonalEmail);
    }
  };

  const validateEmail = useCallback(
    (email: string, usePersonalEmail: boolean) => {
      if (!email) {
        setEmailError("");
        return;
      }

      const personalEmailDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "aol.com",
        "icloud.com",
        "me.com",
        "mac.com",
        "live.com",
        "msn.com",
        "ymail.com",
        "rocketmail.com",
        "protonmail.com",
        "tutanota.com",
        "zoho.com",
      ];

      const emailDomain = email.split("@")[1]?.toLowerCase();

      if (
        !usePersonalEmail &&
        emailDomain &&
        personalEmailDomains.includes(emailDomain)
      ) {
        setEmailError(
          'Please use your business email address or check "I don\'t have a business email" below.'
        );
      } else {
        setEmailError("");
      }
    },
    []
  );

  const handleCheckboxChange = (value: string) => {
    const isChecked = formData.areasOfInterest.includes(value);
    const updatedAreas = isChecked
      ? formData.areasOfInterest.filter((area) => area !== value)
      : [...formData.areasOfInterest, value];

    setFormData({
      ...formData,
      areasOfInterest: updatedAreas,
    });

    // Checkbox interaction tracking removed
  };

  const handlePersonalEmailChange = (checked: boolean) => {
    setFormData({
      ...formData,
      usePersonalEmail: checked,
    });

    // Checkbox interaction tracking removed

    // Re-validate email when checkbox changes
    if (formData.email) {
      validateEmail(formData.email, checked);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900 relative px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Let's Start Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Transformation
            </span>
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            Schedule a personalized demo or get in touch with our team.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Contact Form - Compact Layout */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-gray-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              data-track="contact_form_submit"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-1.5">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-1.5">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-1.5">
                    Business Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-black/40 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none transition-colors ${
                      emailError
                        ? "border-red-500 focus:border-red-400"
                        : "border-white/10 focus:border-blue-500"
                    }`}
                    required
                  />
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1">{emailError}</p>
                  )}
                  <label className="flex items-center space-x-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={formData.usePersonalEmail}
                      onChange={(e) =>
                        handlePersonalEmailChange(e.target.checked)
                      }
                      className="w-3.5 h-3.5 text-blue-500 bg-gray-900 border-white/10 rounded focus:ring-blue-500 focus:ring-1"
                    />
                    <span className="text-gray-500 text-xs">
                      Use personal email
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-white text-sm font-medium mb-1.5">
                    Company <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-white text-sm font-medium mb-1.5">
                    Job Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-white text-sm font-medium mb-1.5">
                    Team Size
                  </label>
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">Select...</option>
                    <option value="1-5">1-5</option>
                    <option value="6-15">6-15</option>
                    <option value="16-50">16-50</option>
                    <option value="51-100">51-100</option>
                    <option value="100+">100+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Interests
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "AI Hunter & Contact Intelligence",
                    "Lead Generation & Management",
                    "Email Marketing Automation",
                    "Pre-Sales Automation (PSA)",
                    "Multi-GPT Research",
                    "Call Center Solutions",
                    "Sales Outsourcing",
                    "Data Enrichment",
                    "AI Digital Marketing",
                    "SDR as a Service",
                    "Custom Implementation",
                    "Other",
                  ].map((area) => (
                    <label
                      key={area}
                      className="flex items-center space-x-2 cursor-pointer bg-black/20 rounded px-2 py-1.5 hover:bg-black/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.areasOfInterest.includes(area)}
                        onChange={() => handleCheckboxChange(area)}
                        className="w-3.5 h-3.5 text-blue-500 bg-gray-900 border-white/10 rounded focus:ring-blue-500 focus:ring-1"
                      />
                      <span className="text-gray-400 text-xs leading-tight">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-1.5">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any specific challenges?"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Captcha Aligned Right */}
              <div className="flex justify-end pt-2">
                <div className="transform scale-90 origin-right">
                   <CaptchaOTP onCaptchaVerified={setCaptchaVerified} />
                </div>
              </div>

              {submitStatus.type && (
                <div
                  className={`p-3 rounded-lg text-sm border ${
                    submitStatus.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={!!emailError || isSubmitting || !captchaVerified}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 ${
                  emailError || isSubmitting || !captchaVerified
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                }`}
                whileHover={!emailError && !isSubmitting && captchaVerified ? { scale: 1.01 } : {}}
                whileTap={!emailError && !isSubmitting && captchaVerified ? { scale: 0.99 } : {}}
              >
                <span>
                  {isSubmitting 
                    ? "Sending..." 
                    : !captchaVerified 
                      ? "Verify Captcha to Send"
                      : "Book Demo"
                  }
                </span>
                {!isSubmitting && captchaVerified && <Send className="w-3.5 h-3.5" />}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info & FAQ - Compact Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-gray-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">Quick Connect</h3>
              <div className="space-y-4">
                <a href="mailto:info@salescentri.com" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">info@salescentri.com</span>
                </a>
                <a href="tel:+14157544494" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Phone className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">+1 415-754-4766</span>
                </a>
                <button 
                  onClick={() => setShowSalesGPTModal(true)}
                  className="flex items-center gap-3 group w-full text-left"
                >
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Live Chat (24/7)</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">Common Questions</h3>
              <div className="space-y-3">
                {[
                  {
                    question: "How quickly can I see results?",
                    answer: "Most clients see significant improvements in their sales process within the first 30 days."
                  },
                  {
                    question: "What CRM integrations do you support?",
                    answer: "We integrate seamlessly with all major CRM platforms including Salesforce, HubSpot, Zoho, Pipedrive, and more."
                  },
                  {
                    question: "How do you ensure data accuracy?",
                    answer: "We employ multi-layer verification processes and real-time data validation to maintain 95%+ data accuracy."
                  },
                  {
                    question: "What makes you different?",
                    answer: "Our unique combination of AI-powered automation and comprehensive sales solutions sets us apart."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="text-white text-sm font-medium hover:text-blue-400 transition-colors text-left flex-grow"
                      >
                        {faq.question}
                      </button>
                      <span className="text-gray-500 text-xs transform transition-transform duration-200" style={{ transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>
                    <div className={`mt-2 text-gray-400 text-xs leading-relaxed overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {faq.answer}
                      {openFaqIndex === index && (
                        <button
                          onClick={() => window.location.href = '/solutions/psa-suite-one-stop-solution'}
                          className="mt-2 text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1"
                        >
                          Talk to SalesGPT <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
