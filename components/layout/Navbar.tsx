'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, Menu, X, ChevronRight, LogOut, ArrowLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/context/CartContext';
import { useWishlistStore } from '@/context/WishlistContext';
import SearchOverlay from './SearchOverlay';

import { useAuthStore } from '@/context/AuthContext';

const navLinks = [
  { label: 'All', href: '/products' },
  { label: 'Baseball', href: '/products?category=baseball-caps' },
  { label: 'Snapbacks', href: '/products?category=snapback-caps' },
  { label: 'Trucker', href: '/products?category=trucker-caps' },
  { label: 'Beanies', href: '/products?category=beanies' },
  { label: 'Sale', href: '/products?category=sale' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const isHome = pathname === '/';
  const isTransparent = false;

  const items = useCartStore((s) => s.items);
  const isCartBouncing = useCartStore((s) => s.isCartBouncing);
  const { onOpen: onWishlistOpen, items: wishlistItems } = useWishlistStore();
  const { user, profile, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const handleScroll = () => {
      // Logic for scrolled if needed, but it's unused
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => { 
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    const timer = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // Smart Back Navigation
  const handleBack = () => {
    // If we're on a deep page (products/id or checkout), go to relevant top level
    if (pathname.includes('/products/')) {
      router.push('/products');
    } else if (pathname.includes('/checkout')) {
      router.push('/cart');
    } else if (pathname.includes('/signin') || pathname.includes('/profile')) {
      router.push('/');
    } else {
      // Fallback to browser back, but default to Home if history is messy
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  return (
    <>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent 
            ? 'bg-transparent py-4 sm:py-6 border-b-transparent' 
            : 'bg-white/95 backdrop-blur-md shadow-md border-b-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between py-2.5 sm:py-3 relative">
          {/* Left: Back & Menu */}
          <div className="flex items-center justify-start gap-1 sm:gap-2 z-10">
            {/* Back Button - Only shows if not home and mounted */}
            {mounted && !isHome && (
              <button 
                onClick={handleBack}
                className="p-2 hover:opacity-70 transition-opacity duration-300 flex items-center"
                aria-label="Go back"
              >
                <ArrowLeft size={20} strokeWidth={1.5} />
              </button>
            )}

            {/* Home Button */}
            <Link 
              href="/" 
              className="p-2 hover:opacity-70 transition-opacity duration-300 flex items-center"
              aria-label="Home"
            >
              <Home size={20} strokeWidth={1.5} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Menu"
              className="p-2 hover:opacity-70 transition-opacity duration-300"
              onClick={() => setMobileOpen(true)}
              suppressHydrationWarning
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Center: Logo - Absolute Centering */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="flex items-center">
              <Image
                src="https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/logo-1776881142841.webp"
                alt="GLOYAS Logo"
                width={120}
                height={40}
                className={`h-7 sm:h-10 w-auto object-contain hover:opacity-80 transition-all duration-300 ${
                  isTransparent ? 'brightness-0 invert' : ''
                }`}
                priority
              />
            </Link>
          </div>

          {/* Right: Search, Account, Wishlist, Cart */}
          <div className="flex items-center justify-end gap-1 sm:gap-4 z-10">
            {/* Search */}
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:opacity-70 transition-opacity duration-300"
              suppressHydrationWarning
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            <Link
              href={isAuthenticated ? "/profile" : "/signin"}
              aria-label="Account"
              className="p-2 hover:opacity-70 transition-opacity duration-300 hidden md:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </Link>

            <button
              aria-label="Wishlist"
              onClick={onWishlistOpen}
              className="p-2 hover:opacity-70 transition-opacity duration-300 relative"
              suppressHydrationWarning
            >
              <Heart size={22} strokeWidth={1.5} />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0080FF] text-white text-[9px] font-semibold flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            <Link
              href="/cart"
              aria-label="Cart"
              className={`p-2 hover:opacity-70 transition-opacity duration-300 relative ${
                isCartBouncing ? 'animate-cart-bounce' : ''
              }`}
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[11px] font-semibold flex items-center justify-center rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </nav>

      {/* Mobile Menu — Full-screen immersive drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-[320px] sm:max-w-[380px] bg-white flex flex-col"
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#F0F0F0]">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Image 
                    src="https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/logo-1776881142841.webp" 
                    alt="GLOYAS" 
                    width={100} 
                    height={32} 
                    className="h-8 w-auto object-contain" 
                  />
                </Link>
                <button
                  aria-label="Close menu"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* User greeting */}
              {mounted && isAuthenticated && (user || profile) && (
                <Link 
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="mx-5 mt-5 p-4 bg-gradient-to-r from-[#0080FF]/5 to-[#59A9F8]/5 border border-[#0080FF]/10 flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0080FF] to-[#59A9F8] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(profile?.full_name || user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111111] truncate">
                      {profile?.full_name || user?.name || 'User'}
                    </p>
                    <p className="text-[10px] text-[#0080FF] font-bold uppercase tracking-widest">
                      {profile?.role || 'member'}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-[#CCCCCC] group-hover:text-[#0080FF] transition-colors" />
                </Link>
              )}

              {/* High Priority Admin Access */}
              {mounted && profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="mx-5 mt-4 p-4 bg-[#0080FF] text-white flex items-center gap-3 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest">Admin Panel</p>
                    <p className="text-[10px] opacity-80 font-medium">Manage Store & Orders</p>
                  </div>
                  <ChevronRight size={18} />
                </Link>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-5 px-5" data-lenis-prevent>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#BBBBBB] mb-4 px-1">
                  Shop
                </p>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center justify-between py-3.5 px-3 rounded-lg text-[15px] font-medium text-[#333333] hover:bg-[#F9F9F9] hover:text-[#0080FF] transition-all duration-200 group"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span>{link.label}</span>
                        <ChevronRight size={16} className="text-[#DDDDDD] group-hover:text-[#0080FF] group-hover:translate-x-0.5 transition-all duration-200" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-[#F0F0F0]">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#BBBBBB] mb-4 px-1">
                    Quick Access
                  </p>
                  <div className="flex flex-col gap-1">
                    <button
                      className="flex items-center gap-3 py-3.5 px-3 rounded-lg text-[15px] font-medium text-[#333333] hover:bg-[#F9F9F9] hover:text-[#0080FF] transition-all duration-200 w-full text-left"
                      onClick={() => {
                        setMobileOpen(false);
                        onWishlistOpen();
                      }}
                    >
                      <Heart size={18} strokeWidth={1.5} />
                      <span className="flex-1">Wishlist</span>
                      {mounted && wishlistItems.length > 0 && (
                        <span className="w-5 h-5 bg-[#0080FF] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                          {wishlistItems.length}
                        </span>
                      )}
                    </button>
                    <Link
                      href="/cart"
                      className="flex items-center gap-3 py-3.5 px-3 rounded-lg text-[15px] font-medium text-[#333333] hover:bg-[#F9F9F9] hover:text-[#0080FF] transition-all duration-200"
                      onClick={() => setMobileOpen(false)}
                    >
                      <ShoppingBag size={18} strokeWidth={1.5} />
                      <span className="flex-1">Cart</span>
                      {mounted && totalItems > 0 && (
                        <span className="w-5 h-5 bg-[#0080FF] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-[#F0F0F0] bg-[#FAFAFA]">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full py-3.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0080FF] hover:opacity-70 transition-all duration-300"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3.5 bg-[#0080FF] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#006bdd] transition-colors shadow-lg shadow-blue-500/20"
                  >
                    Sign In
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
