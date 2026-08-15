import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: "GLOYAS — Brand Strategy, Web Design & Marketing Services",
  description:
    "We build brands, websites, and marketing campaigns that refuse to look average. Outcome-driven strategy and custom digital platforms.",
  keywords: ["branding agency", "website design", "rebranding", "marketing services", "brand strategy", "GLOYAS"],
  icons: {
    icon: "/images/Gloyas-favicon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GLOYAS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <SmoothScroll>
          <Navbar />
          <main className="flex-1 pt-16 sm:pt-20">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
