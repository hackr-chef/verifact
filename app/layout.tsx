import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/components/supabase-provider";
import NavBar from "@/components/nav-bar";
import { VercelAnalytics } from "@/components/analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VeriFact - Instant Fact-Checking",
  description: "Real-time AI feedback based on real-world data",
  manifest: "/manifest.json",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo.svg',
    },
  },
};

export const viewport = {
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SupabaseProvider>
          <NavBar />
          {children}
          <VercelAnalytics />
        </SupabaseProvider>
      </body>
    </html>
  );
}

