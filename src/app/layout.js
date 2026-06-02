import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = 'https://solarpowerbreakeven.com';
const siteName = 'Solar Power Breakeven';
const description =
  'A real-life, data-driven breakeven analysis of a residential solar power installation in Oklahoma on PSO (Public Service Company of Oklahoma) with net monthly metering. Track actual monthly electricity bills, savings, EV charging cost offsets, and the projected payoff date and 25-year ROI of a home solar system.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Solar Power Breakeven — Real Residential Solar Payoff Tracker',
    template: '%s | Solar Power Breakeven',
  },
  description,
  applicationName: siteName,
  keywords: [
    'solar power breakeven',
    'residential solar payback period',
    'solar panel ROI',
    'solar savings calculator',
    'home solar payoff',
    'solar vs grid electricity cost',
    'EV charging solar savings',
    'solar panel investment return',
    'solar breakeven analysis',
    'real solar electricity bills',
    'Oklahoma solar',
    'PSO net metering',
    'Public Service Company of Oklahoma solar',
    'net monthly metering',
  ],
  authors: [{ name: 'Holden Mitchell' }],
  creator: 'Holden Mitchell',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    title: 'Solar Power Breakeven — Real Residential Solar Payoff Tracker',
    description,
    images: [
      {
        url: '/solarpowerbreakeven.png',
        width: 1024,
        height: 1024,
        alt: 'Solar Power Breakeven logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Power Breakeven — Real Residential Solar Payoff Tracker',
    description,
    images: ['/solarpowerbreakeven.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description,
      publisher: { '@id': `${siteUrl}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Holden Mitchell',
    },
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapp`,
      name: siteName,
      url: siteUrl,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript',
      description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      creator: { '@id': `${siteUrl}/#person` },
      about: [
        { '@type': 'Thing', name: 'Residential solar power' },
        { '@type': 'Thing', name: 'Solar panel return on investment' },
        { '@type': 'Thing', name: 'Electric vehicle charging savings' },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-E6RW4WM2FT" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-E6RW4WM2FT');
        `}
      </Script>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
