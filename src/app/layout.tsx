import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import prisma from '@/lib/prisma';
import { SiteSettingsData } from '@/types';

export const metadata: Metadata = {
  title: {
    default: 'House No. 230 — The Gourmet Kitchen & Bar',
    template: '%s | House No. 230',
  },
  description:
    'Experience House No. 230 — The Gourmet Kitchen & Bar. Indulge in an exquisite culinary journey featuring artisanal dishes, specialty platters, crafted beverages, and a luxurious dining atmosphere in India.',
  keywords: [
    'House No. 230',
    'Gourmet Kitchen',
    'Bar',
    'Restaurant India',
    'Fine Dining',
    'Cocktails & Mocktails',
    'Platters & Sizzlers',
    'Table Reservations',
  ],
  authors: [{ name: 'House No. 230' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'House No. 230 — The Gourmet Kitchen & Bar',
    description:
      'Indulge in an exquisite culinary journey with multicuisine gourmet dishes, curated cocktails, and an enchanting dining ambiance.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'House No. 230',
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getSiteSettings(): Promise<SiteSettingsData | null> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
    });
    return settings as SiteSettingsData | null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  // Schema.org Restaurant Structured Data (Truthful: only includes verified restaurant attributes)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'House No. 230 — The Gourmet Kitchen & Bar',
    servesCuisine: ['Multicuisine', 'North Indian', 'Continental', 'Pan-Asian', 'Gourmet'],
    acceptsReservations: 'True',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    ...(settings?.address ? { address: { '@type': 'PostalAddress', streetAddress: settings.address } } : {}),
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-deep-black text-warm-ivory min-h-screen flex flex-col selection:bg-gold/30 selection:text-gold-light">
        <AnnouncementBar
          active={settings?.announcementActive || false}
          text={settings?.announcementText}
        />
        <Navbar
          restaurantName={settings?.restaurantName || 'House No. 230'}
          tagline={settings?.tagline || 'The Gourmet Kitchen & Bar'}
        />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
