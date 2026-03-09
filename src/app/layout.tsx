import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppTopBar } from "@/components/AppTopBar";
import { I18nProvider } from "@/components/I18nProvider";
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
  title: "front-arte7",
  description: "CRUD de actors, movies y directors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <I18nProvider>
          <AppTopBar />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
