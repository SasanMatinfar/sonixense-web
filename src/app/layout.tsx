import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import brandIcon from "../../SoniXense-Brand-Kit/02-Web/favicon/favicon-colour.svg";
import brandAppleIcon from "../../SoniXense-Brand-Kit/02-Web/favicon/apple-touch-icon.png";
import brandOgImage from "../../SoniXense-Brand-Kit/02-Web/social/og-image-1200x630.png";

const inter = localFont({
  src: [
    { path: "../../SoniXense-Brand-Kit/05-Fonts/Inter/Inter-Regular.ttf", weight: "400" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/Inter/Inter-Medium.ttf", weight: "500" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/Inter/Inter-SemiBold.ttf", weight: "600" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/Inter/Inter-Bold.ttf", weight: "700" },
  ],
  variable: "--font-body",
  display: "swap",
});

const manrope = localFont({
  src: [
    { path: "../../SoniXense-Brand-Kit/05-Fonts/Manrope/Manrope-Light.ttf", weight: "300" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/Manrope/Manrope-Regular.ttf", weight: "400" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/Manrope/Manrope-Medium.ttf", weight: "500" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/Manrope/Manrope-SemiBold.ttf", weight: "600" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/Manrope/Manrope-Bold.ttf", weight: "700" },
  ],
  variable: "--font-heading",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "../../SoniXense-Brand-Kit/05-Fonts/IBM-Plex-Mono/IBMPlexMono-Regular.ttf", weight: "400" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/IBM-Plex-Mono/IBMPlexMono-Medium.ttf", weight: "500" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/IBM-Plex-Mono/IBMPlexMono-SemiBold.ttf", weight: "600" },
    { path: "../../SoniXense-Brand-Kit/05-Fonts/IBM-Plex-Mono/IBMPlexMono-Bold.ttf", weight: "700" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sonixense.com"),
  title: { default: "SoniXense — Beyond Vision", template: "%s | SoniXense" },
  description:
    "SoniXense transforms complex information into intelligent auditory interaction — sonification for surgical navigation, medical technology, and human perception.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SoniXense — Beyond Vision",
    description:
      "Intelligent auditory interaction and sonification for complex systems, with surgery as the first frontier.",
    url: "https://sonixense.com/",
    siteName: "soniXense",
    images: [
      {
        url: brandOgImage.src,
        alt: "SoniXense — Beyond Vision",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoniXense — Beyond Vision",
    description:
      "Intelligent auditory interaction and sonification for complex systems, with surgery as the first frontier.",
    images: [brandOgImage.src],
  },
  icons: {
    icon: brandIcon.src,
    shortcut: brandIcon.src,
    apple: brandAppleIcon.src,
  },
};

export const viewport: Viewport = { themeColor: "#071D23" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} ${plexMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
