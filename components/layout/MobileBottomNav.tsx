'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, User, Grid3X3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/context/CartContext';
import { useAuthStore } from '@/context/AuthContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const items = useCartStore((s) => s.items);
  const { isAuthenticated } = useAuthStore();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Don't show on home hero (top of page)

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/products', icon: Grid3X3, label: 'Shop' },
    { href: '/cart', icon: ShoppingBag, label: 'Cart', badge: mounted ? totalItems : 0 },
    { href: isAuthenticated ? '/profile' : '/signin', icon: User, label: 'Account' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* Glassmorphism background */}
          <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_30px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-around px-2 py-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative flex flex-col items-center justify-center gap-0.5 py-2 px-4 min-w-[60px] transition-all duration-300 ${
                      active ? 'text-[#0080FF]' : 'text-[#999999]'
                    }`}
                  >
                    {/* Active indicator dot */}
                    {active && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -top-1 w-5 h-[3px] bg-gradient-to-r from-[#0080FF] to-[#59A9F8] rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <div className="relative">
                      <item.icon
                        size={22}
                        strokeWidth={active ? 2 : 1.5}
                        className={`transition-all duration-300 ${active ? 'scale-110' : ''}`}
                      />
                      {/* Cart badge */}
                      {item.badge !== undefined && item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-2.5 w-[18px] h-[18px] bg-[#0080FF] text-white text-[9px] font-bold flex items-center justify-center rounded-full"
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </motion.span>
                      )}
                    </div>
                    <span className={`text-[10px] tracking-wide transition-all duration-300 ${
                      active ? 'font-bold' : 'font-medium'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
