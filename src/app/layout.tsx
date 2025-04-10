import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FlyonuiScript from "@/components/FlyonuiScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="An open source index of all the Create Minecraft mod related plugins." />
        <meta property="og:title" content="Create Mod Index" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="An open source index of all the Create Minecraft mod related plugins." />
        <meta name="theme-color" content="#fab387" />
        <title>Create Mod Index</title>
        <link rel="stylesheet" href="../../styles/output.css" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <FlyonuiScript />
      </body>
    </html>
  );
}
