'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <section
      id="hero-launching-soon"
      className="relative w-full overflow-hidden flex items-center justify-center h-[60vh] sm:h-[100svh]"
    >
      {/* ── Responsive Background Image ── */}
      <picture className="absolute inset-0 z-0">
        <source media="(max-width: 768px)" srcSet="https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/mobilehero-1777800522191.webp" />
        <img
          src="https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/deskhero-1777800495614.webp"
          alt="Hero Background"
          className="w-full h-full object-cover object-top translate-y-12"
        />
        {/* Optional: Subtle dark overlay to keep it consistent with the site theme */}
        <div className="absolute inset-0 bg-black/20" />
      </picture>

      {/* Content removed as requested */}
    </section>
  );
}
