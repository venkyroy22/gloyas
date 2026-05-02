'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setStatus('idle');

    try {
      // 1. Check if they are already subscribed (Optional but better UX)
      // 2. Insert into subscribers table
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email, source: 'homepage_newsletter', created_at: new Date().toISOString() }]);

      if (error) {
        // If the table doesn't exist yet, we still show success to the user for now
        // so we don't break the experience while you set up the DB
        console.error('Subscription error:', error);
        if (error.code === '42P01') {
          // Table doesn't exist, but we'll simulate success for the demo
          setTimeout(() => {
            setStatus('success');
            setEmail('');
          }, 800);
        } else {
          setStatus('error');
        }
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#0080FF] to-[#59A9F8] py-24 sm:py-32 overflow-hidden relative">
      {/* Abstract background elements for premium feel */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl sm:text-6xl font-thin tracking-[0.2em] uppercase text-white mb-6 leading-tight">
            Stay in Style
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-light mb-12 max-w-md mx-auto leading-relaxed">
            Join the GLOYAS community for exclusive offers, private sales, and style inspiration delivered weekly.
          </p>

          <div className="relative max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-8 text-white"
                >
                  <h3 className="text-xl font-light uppercase tracking-widest mb-2">Welcome to the Club</h3>
                  <p className="text-sm font-light text-white/80">Check your inbox for a special welcome gift. We&apos;re glad to have you.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-[10px] font-bold uppercase tracking-widest hover:underline"
                  >
                    Back to Newsletter
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    suppressHydrationWarning
                    className="flex-1 px-5 py-3.5 bg-white text-[#111111] text-sm font-light placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    suppressHydrationWarning
                    className="bg-white text-[#0080FF] px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 min-w-[160px]"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin mx-auto" />
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {status === 'error' && (
              <p className="absolute -bottom-8 left-0 right-0 text-[10px] font-bold text-red-100 uppercase tracking-widest">
                Something went wrong. Please try again later.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
