'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import OtpInput from '@/components/ui/OtpInput';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'info' | 'verify'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            full_name: name,
          },
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      setStep('verify');
      setCountdown(60);
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Signup Error:', error);
      alert('Error: ' + (error.message || JSON.stringify(error)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });

      if (error) {
        // Try 'signin' type if signup fails (case where user already exists but isn't verified)
        const { error: signInError } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email',
        });
        if (signInError) throw signInError;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Verification Error:', error);
      alert('Error: ' + (error.message || JSON.stringify(error)));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[#F8F8F8]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#EEEEEE] text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle size={40} strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-[#111111] mb-4 uppercase">Welcome to GLOYAS</h1>
          <p className="text-[#666666] text-sm leading-relaxed mb-8">
            Your account has been successfully verified. Redirecting you to the store...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-[#F8F8F8] relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#EEEEEE]"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-tight text-[#111111] mb-3 uppercase">
            {step === 'info' ? 'Join GLOYAS' : 'Verify Account'}
          </h1>
          <p className="text-[10px] text-[#999999] uppercase tracking-[0.2em]">
            {step === 'info' ? 'Create your account with Email OTP' : `Code sent to ${email}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'info' ? (
            <motion.form
              key="info-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#999999]">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#999999] group-focus-within:text-[#0080FF] transition-colors">
                    <User size={18} strokeWidth={1.5} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-white border border-[#EEEEEE] focus:border-[#0080FF] focus:outline-none transition-all duration-300 text-sm"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#999999]">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#999999] group-focus-within:text-[#0080FF] transition-colors">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-white border border-[#EEEEEE] focus:border-[#0080FF] focus:outline-none transition-all duration-300 text-sm"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || countdown > 0}
                className="w-full py-4 bg-[#0080FF] text-white text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#006bdd] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <>
                    Send OTP Code
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="verify-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#999999]">8-Digit Code</label>
                  <OtpInput
                    length={8}
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                  />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#0080FF] text-white text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#006bdd] transition-all duration-300 group disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify & Create Account
                    <CheckCircle size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('info')}
                className="w-full py-2 text-[10px] text-[#999999] uppercase tracking-widest font-bold hover:text-[#0080FF] transition-colors"
              >
                Change Email
              </button>

              <div className="pt-4 text-center border-t border-[#EEEEEE]">
                <p className="text-[10px] text-[#999999] uppercase tracking-widest mb-2">Didn&apos;t receive a code?</p>
                <button
                  type="button"
                  disabled={countdown > 0 || isLoading}
                  onClick={handleSendOtp}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#0080FF] hover:underline disabled:text-[#CCCCCC] disabled:no-underline"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code Now'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center text-[10px] text-[#666666] uppercase tracking-widest font-bold">
          Already have an account?{' '}
          <Link href="/signin" className="text-[#0080FF] hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
