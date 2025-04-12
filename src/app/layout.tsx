import type { Metadata, Viewport } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Create Mod Index",
  description: "An open source index of all the Create Minecraft mod related plugins.",
  openGraph: {
    title: "Create Mod Index",
    description: "An open source index of all the Create Minecraft mod related plugins.",
    type: "website",
  }
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  themeColor: "#fab387",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-rbase">
      <body
        className={`antialiased justify-center mx-auto max-w-[100rem] p-3 text-lg bg-rbase text-rtext`}
      >
        {children}

      </body>
    </html>
  );
}
