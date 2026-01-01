'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Users, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
export default function OpenPositionsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error' | null, message: string}>({
    type: null,
    message: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    currentCTC: '',
    experience: '',
    resume: null as File | null
  });

  // Scroll to contact form and set selected role
  const handleApplyNow = (positionTitle: string) => {
    setSelectedRole(positionTitle);
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone);
      submitFormData.append('city', formData.city);
      submitFormData.append('role', selectedRole);
      submitFormData.append('currentCTC', formData.currentCTC);
      submitFormData.append('experience', formData.experience);
      
      if (formData.resume) {
        submitFormData.append('resume', formData.resume);
      }

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: submitFormData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! You will receive a confirmation email shortly.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          currentCTC: '',
          experience: '',
          resume: null
        });
        setSelectedRole('');
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit application. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPositions = [
    {
      id: 1,
      title: "Junior Sales Executive",
      department: "Sales",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "0-2 years",
      level: "Junior",
      description: "Drive sales growth by identifying prospects, building relationships, and closing deals for our AI-powered sales automation platform.",
      requirements: ["0-2 years sales experience", "Excellent communication skills", "Goal-oriented mindset", "Basic understanding of CRM tools"],
      benefits: ["Career growth path", "Training programs", "Skill development"],
      urgent: false,
      featured: true
    },
    {
      id: 2,
      title: "Senior Sales Executive",
      department: "Sales",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3-5 years",
      level: "Senior",
      description: "Lead complex sales cycles, manage key accounts, and mentor junior team members while driving revenue growth.",
      requirements: ["3-5 years B2B sales experience", "Proven track record in enterprise sales", "Team leadership experience", "CRM expertise (Salesforce/HubSpot)"],
      benefits: ["Leadership opportunities", "Team mentoring", "Strategic projects"],
      urgent: true,
      featured: true
    },
    {
      id: 3,
      title: "Sales Executive Team Lead",
      department: "Sales",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "5+ years",
      level: "Lead",
      description: "Manage and develop the sales team, set strategic direction, and drive overall sales performance for the region.",
      requirements: ["5+ years sales management experience", "Team building and leadership skills", "Strategic planning experience", "Enterprise sales expertise"],
      benefits: ["Team management role", "Strategic involvement", "Leadership development"],
      urgent: false,
      featured: true
    },
    {
      id: 4,
      title: "Junior Business Development Executive",
      department: "Business Development",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "0-2 years",
      level: "Junior",
      description: "Identify new business opportunities, conduct market research, and support the development of strategic partnerships.",
      requirements: ["0-2 years business development experience", "Research and analytical skills", "Communication and presentation skills", "Market awareness"],
      benefits: ["Exposure to strategy", "Learning opportunities", "Skill development programs"],
      urgent: false,
      featured: false
    },
    {
      id: 5,
      title: "Senior Business Development Executive",
      department: "Business Development",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3-5 years",
      level: "Senior",
      description: "Drive strategic partnerships, expand market presence, and identify new revenue streams for the organization.",
      requirements: ["3-5 years business development experience", "Partnership management experience", "Strategic thinking abilities", "Negotiation skills"],
      benefits: ["Strategic projects", "Partnership opportunities", "Growth exposure"],
      urgent: true,
      featured: false
    },
    {
      id: 6,
      title: "Business Development Manager",
      department: "Business Development",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "5+ years",
      level: "Manager",
      description: "Lead business development strategy, manage key partnerships, and drive organizational growth initiatives.",
      requirements: ["5+ years business development management", "Strategic partnership experience", "Team leadership skills", "Market expansion expertise"],
      benefits: ["Management role", "Strategic decision making", "Leadership development"],
      urgent: false,
      featured: true
    },
    {
      id: 7,
      title: "Junior Lead Generation Specialist",
      department: "Lead Generation",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "0-2 years",
      level: "Junior",
      description: "Generate qualified leads through various channels, manage prospect databases, and support the sales pipeline.",
      requirements: ["0-2 years lead generation experience", "Digital marketing knowledge", "Data analysis skills", "Communication skills"],
      benefits: ["Digital marketing exposure", "Data analysis training", "Skill development"],
      urgent: false,
      featured: false
    },
    {
      id: 8,
      title: "Senior Lead Generation Specialist",
      department: "Lead Generation",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3-5 years",
      level: "Senior",
      description: "Develop and execute lead generation strategies, optimize conversion rates, and manage lead nurturing campaigns.",
      requirements: ["3-5 years lead generation experience", "Marketing automation tools", "Analytics and optimization", "Campaign management"],
      benefits: ["Campaign ownership", "Strategy development", "Skill advancement"],
      urgent: true,
      featured: false
    },
    {
      id: 9,
      title: "Lead Generation Manager",
      department: "Lead Generation",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "5+ years",
      level: "Manager",
      description: "Lead the lead generation team, develop comprehensive strategies, and drive pipeline growth across all channels.",
      requirements: ["5+ years lead generation management", "Team leadership experience", "Multi-channel strategy", "Performance optimization"],
      benefits: ["Team management", "Strategy ownership", "Leadership development"],
      urgent: false,
      featured: true
    }
  ];

  const departments = ['all', 'Sales', 'Business Development', 'Lead Generation'];
  const levels = ['all', 'Junior', 'Senior', 'Lead', 'Manager'];

  const filteredPositions = openPositions.filter(position => {
    const departmentMatch = selectedDepartment === 'all' || position.department === selectedDepartment;
    const levelMatch = selectedLevel === 'all' || position.level === selectedLevel;
    return departmentMatch && levelMatch;
  });

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden hero-section">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Open <span className="text-blue-400">Positions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join our mission to revolutionize sales automation with AI. Build the future of how teams sell and grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const openingsSection = document.querySelector('section:has(h2.text-4xl.font-bold.text-white.mb-6.text-center)');
                  if (openingsSection) {
                    openingsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                View All Positions
              </motion.button>
              <motion.button
                className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { window.location.href = "company-culture"; }}
              >
                Learn About Our Culture
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Job Filters */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold text-white mb-6 text-center">Current Openings</h2>
            <p className="text-xl text-gray-300 text-center mb-8">
              Find your perfect role and help us build the future of AI sales automation
            </p>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center text-gray-400">
              Showing {filteredPositions.length} of {openPositions.length} positions
            </div>
          </motion.div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredPositions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 ${
                  position.featured ? 'border-blue-500/50' : 'border-gray-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-white">{position.title}</h3>
                      <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/20">
                        {position.level}
                      </span>
                      {position.featured && (
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      )}
                      {position.urgent && (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Urgent
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {position.department}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {position.type}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {position.experience}
                      </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-4">{position.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2 text-sm">Key Requirements:</h4>
                        <ul className="space-y-1">
                          {position.requirements.slice(0, 2).map((req, i) => (
                            <li key={i} className="text-gray-400 text-xs flex items-center gap-2">
                              <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2 text-sm">Benefits:</h4>
                        <div className="flex flex-wrap gap-2">
                          {position.benefits.slice(0, 3).map((benefit, i) => (
                            <span key={i} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:flex-shrink-0">
                    <motion.button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApplyNow(position.title)}
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPositions.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No positions found</h3>
              <p className="text-gray-400">Try adjusting your filters or check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Hiring Process</h2>
            <p className="text-xl text-gray-300">
              We&apos;ve designed our process to be efficient, transparent, and focused on finding the right mutual fit
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Application", description: "Submit your application with resume and cover letter" },
              { step: "2", title: "Phone Screen", description: "30-minute call with our recruiting team" },
              { step: "3", title: "Technical/Cultural Interview", description: "Deep dive into your skills and cultural fit" },
              { step: "4", title: "Final Interview", description: "Meet the team and discuss your role in detail" }
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  {phase.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{phase.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{phase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Briefcase className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Shape the Future of AI Sales?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Don&apos;t see a perfect fit? We&apos;re always looking for exceptional talent. Send us your resume and let&apos;s talk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApplyNow('General Application')}
              >
                Send Resume for Future Opportunities
              </motion.button>
              <motion.button
                className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const contactForm = document.getElementById('contact-form');
                  if (contactForm) {
                    contactForm.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Contact Our Recruiting Team
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Apply for Position</h2>
            <p className="text-xl text-gray-300">
              {selectedRole ? `Applying for: ${selectedRole}` : 'Fill out the form below to apply for any position'}
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleFormSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your city"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Role *</label>
                <select
                  required
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="">Select a role</option>
                  {openPositions.map(position => (
                    <option key={position.id} value={position.title}>{position.title}</option>
                  ))}
                  <option value="General Application">General Application</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Previous/Current Annual CTC (in Lakhs) *</label>
                <input
                  type="text"
                  required
                  value={formData.currentCTC}
                  onChange={(e) => setFormData({...formData, currentCTC: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Ex: 3.2"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Experience & Skills</label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Describe your experience, skills, and why you're interested in this role..."
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Upload Resume *</label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFormData({...formData, resume: e.target.files?.[0] || null})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              <p className="text-xs text-gray-400 mt-2">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
            </div>

            {/* Status Messages */}
            {submitStatus.type && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-900/50 border border-green-500/50 text-green-300' 
                  : 'bg-red-900/50 border border-red-500/50 text-red-300'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-8 py-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                isSubmitting 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
              }`}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </main>
    </>
  );
}
