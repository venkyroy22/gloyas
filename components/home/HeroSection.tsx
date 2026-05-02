'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  /* letter-by-letter animation for "Launching Soon" */
  const headline = 'Launching Soon';
  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 40, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: 0.6 + i * 0.05,
        type: 'spring',
        stiffness: 100,
        damping: 14,
      },
    }),
  };

  return (
    <section
      id="hero-launching-soon"
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: '100svh' }}
    >
      {/* ── Deep dark base ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #020a18 40%, #051525 70%, #0a1e35 100%)',
        }}
      />

      {/* ── Subtle dark radial vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(5,25,50,0.3) 0%, #000000 100%)',
        }}
      />

      {/* ── The Planet / Horizon Arc ── */}
      {/* Large ellipse at the bottom simulating the planet surface */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-55%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140%',
          height: '80%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 0%, #0b2545 0%, #040e1a 40%, #010509 70%)',
          boxShadow: 'inset 0 10px 40px rgba(0, 140, 255, 0.1), 0 0 0 1px rgba(0, 140, 255, 0.1)',
        }}
      />

      {/* ── Atmospheric Bloom ── */}
      {mounted && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            bottom: '-55%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140%',
            height: '80%',
            borderRadius: '50%',
            background: 'transparent',
            boxShadow: '0 -20px 100px 10px rgba(0, 128, 255, 0.2)',
            filter: 'blur(40px)',
          }}
          animate={{
            boxShadow: [
              '0 -20px 100px 10px rgba(0, 128, 255, 0.15)',
              '0 -20px 120px 15px rgba(0, 128, 255, 0.3)',
              '0 -20px 100px 10px rgba(0, 128, 255, 0.15)',
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}



      {/* ── Bright top-edge of arc ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-55.1%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140%',
          height: '80%',
          borderRadius: '50%',
          background: 'transparent',
          borderTop: '2px solid rgba(120, 210, 255, 0.9)',
          boxShadow: '0 -5px 20px 2px rgba(0, 140, 255, 0.4)',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
        }}
      />



      {/* ── Faint outer ring (like a faint atmospheric circle) ── */}
      {mounted && (
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            bottom: '-80%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180%',
            height: '120%',
            border: '1px solid rgba(0,128,255,0.04)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* ── Tiny star dots ── */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }, (_, i) => {
            const sx = Math.sin(i * 7.3 + 1) * 10000;
            const sy = Math.sin(i * 13.1 + 3) * 10000;
            const sd = Math.sin(i * 5.7 + 5) * 10000;
            const posX = (sx - Math.floor(sx)) * 100;
            const posY = (sy - Math.floor(sy)) * 65; /* keep stars in upper portion */
            const delay = (sd - Math.floor(sd)) * 6;
            const size = (Math.sin(i * 3.3) * 10000 % 1.5) + 0.8;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${posX}%`,
                  top: `${posY}%`,
                  width: `${Math.abs(size)}px`,
                  height: `${Math.abs(size)}px`,
                }}
                animate={{ opacity: [0.2, 0.7, 0.2] }}
                transition={{
                  duration: 3 + Math.abs(delay),
                  delay: Math.abs(delay),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </div>
      )}
      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl pt-10 sm:pt-0" style={{ marginTop: 'calc(-5vh - 20px)' }}>
        {/* Main headline */}
        <h1
          className="flex flex-wrap justify-center gap-x-[0.3em] text-[10vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[80px] font-bold leading-[1.1] sm:leading-[0.95] tracking-tight select-none"
          style={{
            fontFamily: "var(--font-josefin), 'Josefin Sans', sans-serif",
          }}
        >
          {headline.split(' ').map((word, wordIndex) => (
            <span key={wordIndex} className="whitespace-nowrap flex">
              {word.split('').map((char, charIndex) => {
                const i = headline.indexOf(word) + charIndex;
                return (
                  <motion.span
                    key={charIndex}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block"
                    style={{
                      color: '#ffffff',
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Something extraordinary is on its way. Premium headwear, redefined.
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.0, duration: 0.8, ease: 'easeOut' }}
          className="mt-8 h-[1px] w-24 origin-center"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,160,255,0.6), transparent)',
          }}
        />

        {/* GLOYAS watermark */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          className="mt-6 text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase"
          style={{ color: 'rgba(0,128,255,0.2)' }}
        >
          GLOYAS
        </motion.span>
      </div>
    </section>
  );
}
