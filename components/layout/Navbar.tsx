'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon, CloseIcon, ArrowRightIcon } from '@/components/ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Palette, Smartphone, Megaphone } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { 
    label: 'Services', 
    href: '#',
    subLinks: [
      { label: 'Web Designing', href: '/services/web-designing', icon: Layout },
      { label: 'Branding', href: '/services/branding', icon: Palette },
      { label: 'Social Media Management', href: '/services/social-media-management', icon: Smartphone },
      { label: 'Marketing', href: '/services/marketing', icon: Megaphone },
    ]
  },

  { label: 'Our Process', href: '/process' },
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [mobileOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:w-[90%] lg:max-w-[1200px] z-50">
        <nav className="bg-white border border-gray-200 shadow-sm rounded-full py-3 px-6 sm:px-8 flex items-center justify-between transition-all duration-300">
          
          {/* Logo on the left */}
          <Link href="/" className="flex items-center relative h-8 sm:h-9 w-28">
            <Image
              src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/gloyas-logo-1786600163490.webp"
              alt="GLOYAS Logo"
              fill
              sizes="110px"
              className="object-contain hover:opacity-80 transition-opacity duration-300"
            />
          </Link>

          {/* Desktop Nav Links on the right */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                link.subLinks ? (
                  <div key={link.label} className="relative group">
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 text-[15px] cursor-default text-gray-700 hover:text-black font-medium transition-colors duration-300 ${
                        pathname.startsWith('/services') ? 'text-black' : ''
                      }`}
                    >
                      {link.label}
                      <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                      <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-2 w-64 flex flex-col gap-1">
                        {link.subLinks.map((subLink) => (
                          <Link
                            key={subLink.label}
                            href={subLink.href}
                            className="px-4 py-2.5 flex items-center gap-3 text-[14px] text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors duration-200 whitespace-nowrap"
                          >
                            {subLink.icon && <subLink.icon className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />}
                            <span>{subLink.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[15px] text-gray-700 hover:text-black font-medium transition-colors duration-300 ${
                      pathname === link.href ? 'text-black' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
            
            <div className="flex items-center gap-6 border-l border-gray-200 pl-6">
              {/* Primary Contact CTA button */}
              <Link
                href="/contact"
                className="flex items-center gap-1 px-5 py-2.5 bg-[#252525] text-white hover:bg-black rounded-full text-[15px] font-medium transition-all duration-300"
              >
                <span>Get started</span>
                <span className="text-lg leading-none opacity-70 ml-1">&rsaquo;</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            aria-label="Toggle menu"
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
            onClick={() => setMobileOpen(true)}
            suppressHydrationWarning
          >
            <MenuIcon size={22} />
          </button>

        </nav>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-[300px] bg-white flex flex-col justify-between shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center relative h-6 w-24">
                  <Image 
                    src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/gloyas-logo-1786600163490.webp" 
                    alt="GLOYAS" 
                    fill
                    sizes="96px"
                    className="object-contain" 
                  />
                </Link>
                <button
                  aria-label="Close menu"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto py-6 px-5 flex flex-col gap-2">
                {navLinks.map((link) => (
                  link.subLinks ? (
                    <div key={link.label} className="flex flex-col gap-2">
                      <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        {link.label}
                      </div>
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.label}
                          href={subLink.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between py-3.5 px-4 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-200 ${
                            pathname === subLink.href
                              ? 'bg-[#278DFD]/10 text-[#278DFD]'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>{subLink.label}</span>
                          <ArrowRightIcon size={14} className="opacity-40" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between py-3.5 px-4 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-200 ${
                        pathname === link.href
                          ? 'bg-[#278DFD]/10 text-[#278DFD]'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRightIcon size={14} className="opacity-40" />
                    </Link>
                  )
                ))}
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-5 border-t border-[#E2E8F0] bg-gray-50">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-4 bg-[#278DFD] text-white hover:bg-blue-600 rounded-full text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  Start a Project
                  <ArrowRightIcon size={14} />
                </Link>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
