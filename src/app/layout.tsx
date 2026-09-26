import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  // Light theme canvas color
  themeColor: '#FAF8F5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Resolved site URL for dynamic metadata & OpenGraph crawler previews (WhatsApp, iMessage, Twitter, etc.)
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  siteConfig.seo.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: 'OM Advertising Chomu' }],
  creator: 'OM Advertising',
  publisher: 'OM Advertising',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    url: siteUrl,
    siteName: siteConfig.brand.name,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/om-facility.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'OM Advertising Chomu Facility and 3D Signage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    images: ['/images/om-facility.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable} style={{ colorScheme: 'light' }}>
      {/* Global light theme canvas with warm editorial selection styling */}
      <body className="font-sans antialiased flex flex-col min-h-screen">
        {/* Persistent Luxury Glass Navigation */}
        <Navbar />

        {/* Main Content Viewport */}
        <main id="main-content" className="flex-grow">{children}</main>

        {/* Global Cinematic Footer */}
        <Footer />
      </body>
    </html>
  );
}
