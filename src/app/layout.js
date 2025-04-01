import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Solar Power Breakeven',
  description:
    'Real life breakeven point for solar power on a residential home.',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
