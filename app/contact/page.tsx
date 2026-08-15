'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Web Designing',
    countryCode: '+91',
    contactNumber: '',
    timeline: '1-2 Months',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your form. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white py-12 sm:py-16 min-h-[85vh] flex items-center">
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          
          {/* Left Column: text description */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#278DFD] block mb-3">Get in Touch</span>
              <h1 className="text-[32px] sm:text-6xl lg:text-7xl font-medium text-black leading-[1.1] tracking-tight">
                Start a Project
              </h1>
              <div className="w-20 h-[1px] bg-[#278DFD] mt-6 mb-8" />
              <p className="text-sm font-light text-gray-500 leading-relaxed max-w-sm">
                Provide details about your project goals. We will review your brief and contact you within 24 hours to schedule a diagnostic session.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4 text-xs font-light text-gray-500 border-t border-gray-100 pt-8 max-w-sm">
              <div>
                <span className="font-bold uppercase text-gray-900 tracking-wider block mb-1">Direct Inquiries:</span>
                <a href="mailto:gloyas.connect@gmail.com" className="hover:text-[#278DFD] transition-colors">gloyas.connect@gmail.com</a>
              </div>
              <div>
                <span className="font-bold uppercase text-gray-900 tracking-wider block mb-1">Office Hours:</span>
                <p>Monday &ndash; Friday, 10:00 AM &ndash; 6:00 PM IST</p>
              </div>
            </div>
          </div>

          {/* Right Column: form block */}
          <div className="lg:col-span-7 bg-gray-50 border border-gray-200 rounded-[30px] p-6 sm:p-12 relative overflow-hidden shadow-sm">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 sm:py-20 flex flex-col items-center justify-center gap-6"
                >
                  <div className="w-16 h-16 bg-[#278DFD]/10 text-[#278DFD] rounded-full flex items-center justify-center text-3xl font-light">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-2">
                      Inquiry Received
                    </h3>
                    <p className="text-sm font-light text-gray-500 max-w-md leading-relaxed mx-auto">
                      Thank you for qualifying your project. Our partners are reviewing your details and will get back to your team within one business day.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-8 py-3 bg-[#191A23] text-white text-sm font-medium rounded-[14px] hover:bg-black transition-colors shadow-sm"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  {/* Name & Email Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Your full name"
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-900 border border-gray-200 focus:border-[#278DFD] focus:ring-1 focus:ring-[#278DFD] focus:outline-none transition-all rounded-[12px] shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Work Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-900 border border-gray-200 focus:border-[#278DFD] focus:ring-1 focus:ring-[#278DFD] focus:outline-none transition-all rounded-[12px] shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Company & Project Type Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        placeholder="e.g. Acme Corp"
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-900 border border-gray-200 focus:border-[#278DFD] focus:ring-1 focus:ring-[#278DFD] focus:outline-none transition-all rounded-[12px] shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-900 border border-gray-200 focus:border-[#278DFD] focus:ring-1 focus:ring-[#278DFD] focus:outline-none transition-all h-[46px] rounded-[12px] shadow-sm"
                      >
                        <option value="Web Designing">Web Designing</option>
                        <option value="Branding">Branding</option>
                        <option value="Social Media Management">Social Media Management</option>
                        <option value="Marketing">Marketing</option>
                        <option value="NotSure">I&apos;m not sure</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Number & Timeline Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Contact Number
                      </label>
                      <div className="flex bg-white rounded-[12px] border border-gray-200 shadow-sm focus-within:border-[#278DFD] focus-within:ring-1 focus-within:ring-[#278DFD] transition-all overflow-hidden h-[46px]">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          className="bg-gray-50 border-r border-gray-200 text-sm font-medium text-gray-700 px-2 sm:px-3 py-3 outline-none focus:outline-none w-[70px] sm:w-[90px] cursor-pointer appearance-none text-center"
                          style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 4px center',
                            backgroundSize: '1em'
                          }}
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+61">+61</option>
                          <option value="+971">+971</option>
                          <option value="+65">+65</option>
                        </select>
                        <input
                          type="tel"
                          value={formData.contactNumber}
                          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                          required
                          placeholder="555-000-0000"
                          className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-900 border-none outline-none focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Expected Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-900 border border-gray-200 focus:border-[#278DFD] focus:ring-1 focus:ring-[#278DFD] focus:outline-none transition-all h-[46px] rounded-[12px] shadow-sm"
                      >
                        <option value="Urgent">Less than 1 month</option>
                        <option value="1-2 Months">1–2 Months</option>
                        <option value="2-3 Months">2–3 Months</option>
                        <option value="Flexible">Flexible timeline</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-700">
                      Project Scope & Goals
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      placeholder="Describe what you want to achieve with this project..."
                      rows={5}
                      className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-900 border border-gray-200 focus:border-[#278DFD] focus:ring-1 focus:ring-[#278DFD] focus:outline-none transition-all resize-none rounded-[12px] shadow-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 mt-2 bg-[#278DFD] text-white text-sm font-medium rounded-[14px] hover:bg-[#2075D3] transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Submit Inquiry'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
