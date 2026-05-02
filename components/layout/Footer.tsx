import Link from 'next/link';
import Image from 'next/image';

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E8E8E8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4 col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center relative h-10 sm:h-12 w-32">
              <Image
                src="https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/logo-1776881142841.webp"
                alt="GLOYAS Logo"
                fill
                sizes="128px"
                className="object-contain hover:opacity-80 transition-opacity duration-300"
              />
            </Link>
            <p className="text-xs sm:text-sm font-light text-[#666666] leading-relaxed max-w-[280px]">
              Premium headwear for the modern individual. Curated collections of caps that blend
              timeless elegance with contemporary style.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="https://www.instagram.com/gloyas.in/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 border border-[#E8E8E8] hover:border-[#0080FF] hover:text-[#0080FF] transition-all duration-300"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-2 sm:gap-4">
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#111111]">
              Shop
            </h4>
            <div className="flex flex-col gap-1.5 sm:gap-2.5">
              {[
                { label: 'All Caps', href: '/products' },
                { label: 'Baseball Caps', href: '/products?category=baseball-caps' },
                { label: 'Snapback Caps', href: '/products?category=snapback-caps' },
                { label: 'Trucker Caps', href: '/products?category=trucker-caps' },
                { label: 'Beanies', href: '/products?category=beanies' },
                { label: 'Sale', href: '/products?category=sale' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] sm:text-sm font-light text-[#666666] hover:text-[#0080FF] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div className="flex flex-col gap-2 sm:gap-4">
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#111111]">
              Help
            </h4>
            <div className="flex flex-col gap-1.5 sm:gap-2.5">
              {[
                { label: 'Track Order', href: '/track' },
                { label: 'Customer Service', href: '#' },
                { label: 'Shipping & Delivery', href: '#' },
                { label: 'Returns & Exchanges', href: '#' },
                { label: 'Size Guide', href: '#' },
                { label: 'Contact Us', href: '#' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] sm:text-sm font-light text-[#666666] hover:text-[#0080FF] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-4 col-span-2 lg:col-span-1">
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#111111]">
              About
            </h4>
            <div className="flex flex-col gap-1.5 sm:gap-2.5">
              {['Our Story'].map((link) => (
                <Link
                  key={link}
                  href="/story"
                  className="text-[11px] sm:text-sm font-light text-[#666666] hover:text-[#0080FF] transition-colors duration-300"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E8E8E8]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs font-light text-[#666666]">
            © 2026 GLOYAS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
