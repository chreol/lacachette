import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollJumpButtons from "@/components/ScrollJumpButtons";
import TawkChat from "@/components/TawkChat";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "La Cachette",
    "La Cachette Yaoundé",
    "restaurant Yaoundé",
    "restaurant Ékié",
    "bar lounge Cameroun",
    "cuisine camerounaise Yaoundé",
    "ndolé Yaoundé",
    "poisson braisé Ékié",
    "cocktails Yaoundé",
    "live music Yaoundé",
    "réservation restaurant Yaoundé",
    "vintage africain",
  ],
  authors: [{ name: "La Cachette", url: SITE_URL }],
  creator: "Chreol Empire",
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: `${SITE_NAME} — Vintage Africain · Ékié, Yaoundé`,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "fr_CM",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Entrée de La Cachette, restaurant-bar à Ékié, Yaoundé",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Ékié, Yaoundé`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  icons: {
    icon: "/images/logo.webp",
    apple: "/images/logo.webp",
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${jakarta.variable} min-h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black-ebony text-ivory-cream">
        {children}
        <ScrollJumpButtons />
        <WhatsAppButton />
        <TawkChat />
      </body>
    </html>
  );
}
