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
  title: "soniXense",
  // TODO: Confirm final marketing tone before launch; medical focus and TUM origin are intentional.
  description:
    "SoniXense turns medical imaging and surgical data into sound — deep-tech sonification for the operating room, spinning out of TUM.",
  openGraph: {
    title: "soniXense",
    description:
      "SoniXense turns medical imaging and surgical data into sound — deep-tech sonification for the operating room, spinning out of TUM.",
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
    title: "soniXense",
    description:
      "SoniXense turns medical imaging and surgical data into sound — deep-tech sonification for the operating room, spinning out of TUM.",
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
