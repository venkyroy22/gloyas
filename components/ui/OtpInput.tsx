'use client';

import { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function OtpInput({ length = 6, value, onChange, disabled = false }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(() => {
    const val = value.split('').slice(0, length);
    while (val.length < length) val.push('');
    return val;
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when external value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const val = value.split('').slice(0, length);
      while (val.length < length) val.push('');
      setOtp(val);
    }, 0);
    return () => clearTimeout(timer);
  }, [value, length]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    // Take only the last character if multiple are entered
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Move to next input if value is entered
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    data.split('').forEach((char, i) => {
      if (i < length) newOtp[i] = char;
    });
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus last filled or first empty
    const lastIndex = Math.min(data.length, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-between items-center w-full">
      {otp.map((digit, index) => (
        <div key={index} className="flex-1 aspect-square max-w-[40px] sm:max-w-[50px]">
          <input
            type="text"
            ref={(el) => { inputRefs.current[index] = el; }}
            value={digit}
            maxLength={1}
            disabled={disabled}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="w-full h-full text-center text-lg sm:text-xl font-bold bg-white border border-[#EEEEEE] focus:border-[#0080FF] focus:ring-2 focus:ring-[#0080FF]/10 outline-none transition-all duration-200 uppercase tracking-tight"
            autoComplete="one-time-code"
            inputMode="numeric"
          />
        </div>
      ))}
    </div>
  );
}
