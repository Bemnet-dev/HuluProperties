import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Hulu Properties | Rent or Sell Houses, Land, Cars & Real Estate',
  description: 'The premier destination for renting or selling houses, land parcels, luxury cars, and premium real estate properties. Find off-market assets and verify your next investment.',
  keywords: 'rent, selling, house, land, car, real estate, properties, luxury, investment, hulu properties, buy',
  openGraph: {
    title: 'Hulu Properties | Rent or Sell Houses, Land, Cars & Real Estate',
    description: 'The premier destination for renting or selling houses, land parcels, luxury cars, and premium real estate properties.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased min-h-screen text-zinc-900 bg-zinc-50 flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
