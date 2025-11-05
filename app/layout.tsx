import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "온라인 쇼핑몰",
  description: "Next.js + Clerk + Supabase 기반 쇼핑몰",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY가 설정되지 않았습니다. 환경 변수를 확인해주세요."
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} localization={koKR}>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
          <SyncUserProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
