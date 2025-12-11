import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@/lib/initialize-agents-server'  // Initialize agents on server startup

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAGDOL - Premium Real Estate in Pakistan",
  description: "Find your dream property in Pakistan. Browse apartments, villas, plots, and commercial properties in Lahore, Karachi, Islamabad, and more.",
  keywords: "real estate pakistan, property for sale, buy house pakistan, apartments lahore, villas karachi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#141414',
                color: '#f5f5f5',
                border: '1px solid #333333',
              },
              success: {
                iconTheme: {
                  primary: '#d4af37',
                  secondary: '#141414',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
