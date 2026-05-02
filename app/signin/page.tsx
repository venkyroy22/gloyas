'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import OtpInput from '@/components/ui/OtpInput';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('otp');
  const [otpStep, setOtpStep] = useState<'send' | 'verify'>('send');
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

  const handlePasswordSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setIsLoading(false);
    } else {
      router.push('/');
    }
  };

  const handleSendOtp = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error('OTP Send Error:', error);
      alert('Error: ' + (error.message || JSON.stringify(error)));
      setIsLoading(false);
    } else {
      setOtpStep('verify');
      setCountdown(60);
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    
    if (error) {
      // Try 'signup' type if email type fails (case where user is new and being created)
      const { error: signUpError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });
      if (signUpError) {
        console.error('OTP Verify Error:', signUpError);
        alert('Error: ' + (signUpError.message || JSON.stringify(signUpError)));
        setIsLoading(false);
        return;
      }
    }
    
    router.push('/');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-[#F8F8F8] relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#EEEEEE]"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-tight text-[#111111] mb-3 uppercase">
            {authMethod === 'otp' && otpStep === 'verify' ? 'Verify Code' : 'Sign In'}
          </h1>
          <p className="text-[10px] text-[#999999] uppercase tracking-[0.2em]">
            {authMethod === 'otp' 
              ? (otpStep === 'send' ? 'Login with Email OTP' : `Code sent to ${email}`) 
              : 'Login with your password'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {authMethod === 'password' ? (
            <motion.form
              key="password-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handlePasswordSignin}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#999999]">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#999999]">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-white border border-[#EEEEEE] text-sm focus:border-[#0080FF] outline-none"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#999999]">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#999999]">
                    <Lock size={18} strokeWidth={1.5} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-11 pr-12 py-4 bg-white border border-[#EEEEEE] text-sm focus:border-[#0080FF] outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999]">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#0080FF] text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Login <ArrowRight size={16} /></>}
              </button>

              <button type="button" onClick={() => setAuthMethod('otp')} className="w-full text-[10px] font-bold uppercase tracking-widest text-[#999999] hover:text-[#0080FF]">
                Login with Email OTP instead
              </button>
            </motion.form>
          ) : otpStep === 'send' ? (
            <motion.form
              key="otp-send-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#999999]">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#999999]">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-white border border-[#EEEEEE] text-sm focus:border-[#0080FF] outline-none"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading || countdown > 0} 
                className="w-full py-4 bg-[#0080FF] text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <>Send OTP Code <ArrowRight size={16} /></>
                )}
              </button>

              <button type="button" onClick={() => setAuthMethod('password')} className="w-full text-[10px] font-bold uppercase tracking-widest text-[#999999] hover:text-[#0080FF]">
                Login with Password instead
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-verify-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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

              <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#0080FF] text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Verify & Login <ArrowRight size={16} /></>}
              </button>

              <button type="button" onClick={() => setOtpStep('send')} className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#999999] hover:text-[#0080FF]">
                <ChevronLeft size={14} /> Back / Change Email
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

        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-[#666666]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#0080FF] hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
