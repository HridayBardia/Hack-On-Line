import type { Metadata, Viewport } from "next";
import { Chakra_Petch, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/event";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Hack On-Line // 2027 — Premier 24H Virtual Developer Hackathon",
  description:
    "Hack On-Line 2027 is a 24-hour virtual developer hackathon on January 30–31, 2027. 5 engineering tracks, free entry, registration on Unstop.",
  keywords: [
    "Hack On-Line",
    "hackathon",
    "developer competition",
    "virtual hackathon",
    "coding sprint",
    "software engineering",
    "unstop",
    "hackathon organizer",
  ],
  authors: [{ name: "Hack On-Line Organizing Committee" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Hack On-Line // 2027 — Premier 24H Virtual Developer Hackathon",
    description: "30–31 January 2027 • 100% Virtual • Free Entry • 5 Problem Tracks.",
    url: SITE_URL,
    siteName: "Hack On-Line",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1024,
        height: 1024,
        alt: "Hack On-Line Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hack On-Line // 2027 — Premier 24H Virtual Developer Hackathon",
    description: "30–31 January 2027 • 100% Virtual • Free Entry • 5 Problem Tracks.",
    images: [`${SITE_URL}/logo.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#050607",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${plexSans.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="min-h-dvh bg-[#050607] text-[#F2F7F5] font-sans antialiased selection:bg-brand-green selection:text-black relative overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
