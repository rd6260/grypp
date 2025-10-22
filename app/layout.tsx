import localFont from "next/font/local"
import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Inter } from 'next/font/google';
import Providers from './providers';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({ subsets: ['latin'] });


const helveticaNow = localFont({
  src: [
    { path: "../public/fonts/helvetica-now-display/HelveticaNowDisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/helvetica-now-display/HelveticaNowDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/helvetica-now-display/HelveticaNowDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-helvetica-now", // define a css variable
  display: "swap", // optional for better loading
})

export const metadata: Metadata = {
  title: "Grypp",
  description: "Grypp is super cool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${helveticaNow} antialiased ${inter.className}`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
