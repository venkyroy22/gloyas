'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Website',
    budgetRange: '₹3L – ₹6L',
    timeline: '1-2 Months',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1200);
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
              <h1 className="text-4xl sm:text-6xl font-thin tracking-tight uppercase text-gray-900 leading-tight">
                Start a <span className="font-bold">Project</span>
              </h1>
              <div className="w-20 h-[1px] bg-[#278DFD] mt-6 mb-8" />
              <p className="text-sm font-light text-gray-500 leading-relaxed max-w-sm">
                Provide details about your project goals. We will review your brief and contact you within 24 hours to schedule a diagnostic session.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4 text-xs font-light text-gray-500 border-t border-gray-100 pt-8 max-w-sm">
              <div>
                <span className="font-bold uppercase text-gray-900 tracking-wider block mb-1">Direct Inquiries:</span>
                <a href="mailto:partners@gloyas.com" className="hover:text-[#278DFD] transition-colors">partners@gloyas.com</a>
              </div>
              <div>
                <span className="font-bold uppercase text-gray-900 tracking-wider block mb-1">Office Hours:</span>
                <p>Monday &ndash; Friday, 10:00 AM &ndash; 6:00 PM IST</p>
              </div>
            </div>
          </div>

          {/* Right Column: form block */}
          <div className="lg:col-span-7 bg-white border-2 border-black rounded-[32px] p-6 sm:p-10 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
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
                    <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-gray-900 mb-2">
                      Inquiry Received
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-gray-500 max-w-md leading-relaxed mx-auto">
                      Thank you for qualifying your project. Our partners are reviewing your details and will get back to your team within one business day.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#278DFD] transition-colors"
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Your full name"
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-950 border-2 border-black focus:border-[#278DFD] focus:outline-none transition-colors rounded-[12px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] focus:shadow-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                        Work Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-950 border-2 border-black focus:border-[#278DFD] focus:outline-none transition-colors rounded-[12px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] focus:shadow-none"
                      />
                    </div>
                  </div>

                  {/* Company & Project Type Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        placeholder="e.g. Acme Corp"
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-950 border-2 border-black focus:border-[#278DFD] focus:outline-none transition-colors rounded-[12px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] focus:shadow-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-955 border-2 border-black focus:border-[#278DFD] focus:outline-none transition-colors h-[46px] rounded-[12px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] focus:shadow-none"
                      >
                        <option value="Website">Website Design & Dev</option>
                        <option value="Branding">Brand Strategy & Identity</option>
                        <option value="Rebrand">Corporate Rebranding</option>
                        <option value="Marketing">Growth Marketing Campaigns</option>
                        <option value="NotSure">I&apos;m not sure</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget & Timeline Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                        Estimated Budget Range
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-955 border-2 border-black focus:border-[#278DFD] focus:outline-none transition-colors h-[46px] rounded-[12px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] focus:shadow-none"
                      >
                        <option value="Under 1.5L">Under ₹1.5L</option>
                        <option value="₹1.5L – ₹3L">₹1.5L – ₹3L</option>
                        <option value="₹3L – ₹6L">₹3L – ₹6L</option>
                        <option value="₹6L+">₹6L+</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                        Expected Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-955 border-2 border-black focus:border-[#278DFD] focus:outline-none transition-colors h-[46px] rounded-[12px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] focus:shadow-none"
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
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                      Project Scope & Goals
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      placeholder="Describe what you want to achieve with this project..."
                      rows={5}
                      className="w-full px-4 py-3 bg-white text-sm font-normal text-gray-955 border-2 border-black focus:border-[#278DFD] focus:outline-none transition-colors resize-none rounded-[12px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] focus:shadow-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#278DFD] text-white text-xs font-black uppercase tracking-widest hover:bg-[#278DFD]/90 rounded-full transition-all border border-black shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none flex items-center justify-center gap-2 active:scale-95"
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
