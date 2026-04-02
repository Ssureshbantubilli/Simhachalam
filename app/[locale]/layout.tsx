import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import '../globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Simhachalam — Sri Varaha Lakshmi Narasimha Swamy Temple',
  description:
    'The official digital companion for pilgrims of Sri Varaha Lakshmi Narasimha Swamy Temple, Simhachalam. Giri Pradakshina guidance, RFID safety, and temple information.',
  keywords: ['Simhachalam', 'Narasimha', 'Giri Pradakshina', 'Hindu Temple', 'Visakhapatnam'],
  openGraph: {
    title: 'Simhachalam Temple — Giri Pradakshina Companion',
    description: 'Your sacred digital companion for the 32 KM Giri Pradakshina',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#7A1C1C',
  viewportFit: 'cover',
};

export function generateStaticParams() {
  return ['en', 'te', 'hi', 'or'].map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={`${playfair.variable} ${inter.variable} font-body bg-[#0F0F0F] text-white antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
