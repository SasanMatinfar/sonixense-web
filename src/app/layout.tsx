import "./globals.css";
import { Inter, Syne } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata = {
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
        url: "/images/teaser.png",
        alt: "soniXense — The Future of Multisensory Interaction",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoniXense — Beyond Vision",
    description:
      "Intelligent auditory interaction and sonification for complex systems, with surgery as the first frontier.",
    images: ["/images/teaser.png"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
