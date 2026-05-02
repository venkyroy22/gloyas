import type { Metadata, Viewport } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WishlistPanel from "@/components/product/WishlistPanel";
import SmoothScroll from "@/components/layout/SmoothScroll";

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["100", "300", "400", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "GLOYAS — Premium Headwear & Caps",
  description:
    "Elevate your look with GLOYAS. Discover a curated collection of premium caps, snapbacks, and beanies crafted from the finest materials.",
  keywords: ["caps", "headwear", "premium caps", "snapbacks", "beanies", "hats"],
  icons: {
    icon: "/tab_icon.jpg",
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
    <html lang="en" className={`${josefin.variable} antialiased`} suppressHydrationWarning>
      <body
        className="flex flex-col"
        style={{ fontFamily: "var(--font-josefin), 'Josefin Sans', sans-serif" }}
      >
        <SmoothScroll>
          <Navbar />
          <WishlistPanel />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
