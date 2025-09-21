import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trio AI - Collaborative Intelligence Platform",
  description: "Experience the future of AI collaboration with multiple intelligent agents working together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
        style={{
          backgroundImage: "url('/BACKGROUND.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          margin: 0,
          padding: 0,
          height: '100vh',
          width: '100vw',
        }}
      >
        <main className="flex min-h-screen flex-col items-center justify-center p-6 m-4 h-screen overflow-hidden">
          <h1 className={`${unbounded.className} text-[100px] font-bold text-black mb-6`}>
          TRIO
          </h1>
          {children}
        </main> 
      </body>
    </html>
  );
}

