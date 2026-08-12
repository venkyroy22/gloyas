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
    <footer className="bg-white border-t border-[#E2E8F0]">
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4 col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center relative h-8 sm:h-10 w-28">
              <Image
                src="https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/logo-1776881142841.webp"
                alt="GLOYAS Logo"
                fill
                sizes="110px"
                className="object-contain hover:opacity-80 transition-opacity duration-300"
              />
            </Link>
            <p className="text-xs sm:text-sm font-light text-gray-500 leading-relaxed max-w-[280px]">
              We build brands, websites, and marketing that refuse to look average. Outcome-driven strategy and custom digital platforms.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="https://www.instagram.com/gloyas.in/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 border border-gray-200 rounded-full hover:border-[#278DFD] hover:text-[#278DFD] transition-all duration-300 flex items-center justify-center"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gray-900">
              Services
            </h4>
            <div className="flex flex-col gap-2 sm:gap-3">
              {[
                { label: 'Branding', href: '/services/branding' },
                { label: 'Social Media Management', href: '/services/social-media-management' },
                { label: 'Marketing', href: '/services/marketing' },
                { label: 'Web Designing', href: '/services/web-designing' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] sm:text-sm font-light text-gray-500 hover:text-[#278DFD] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gray-900">
              Company
            </h4>
            <div className="flex flex-col gap-2 sm:gap-3">
              {[
                { label: 'Our Process', href: '/process' },
                { label: 'Pricing Packages', href: '/pricing' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] sm:text-sm font-light text-gray-500 hover:text-[#278DFD] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: About */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gray-900">
              About Us
            </h4>
            <div className="flex flex-col gap-2 sm:gap-3">
              {[
                { label: 'Our Story', href: '/about' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] sm:text-sm font-light text-gray-500 hover:text-[#278DFD] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright divider */}
        <div className="border-t border-[#E2E8F0] mt-10 pt-6 flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-light text-gray-400">
            © 2026 GLOYAS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
