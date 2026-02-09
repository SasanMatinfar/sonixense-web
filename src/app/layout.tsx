import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });



export const metadata: Metadata = {
  title: "soniXense — Sonification & Sonic Interaction Design",
  description: "Designing sound-based representations for data and interactive systems.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${space.variable}`}>
        {children}
      </body>
    </html>
  );
}

