import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const SITE_URL = "https://hackon-line.vercel.app";

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
  themeColor: "#070709",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${syne.variable} scroll-smooth`}
    >
      <body className="min-h-dvh bg-[#070709] text-[#EDEDEF] font-sans antialiased selection:bg-white selection:text-black relative overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
