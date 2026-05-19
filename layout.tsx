import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChatGPT — Portfolio Clone',
  description: 'A pixel-perfect ChatGPT Pro UI clone built with Next.js, Tailwind CSS, and Framer Motion.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0d0d0d] text-white antialiased`}>{children}</body>
    </html>
  );
}
