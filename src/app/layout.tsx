import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import WhatsAppButton from "@/components/WhatsAppButton";
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
  title: "LA CACHETTE — Restaurant-Bar Vintage Africain · Ékié, Yaoundé",
  description:
    "LA CACHETTE : restaurant-bar éco-lounge au concept Vintage Africain haut de gamme à Ékié, Yaoundé. Cuisine camerounaise revisitée, cocktails signature, live sessions acoustiques dans un écrin de bois, bambou et lumière ambrée.",
  keywords: [
    "La Cachette",
    "restaurant Yaoundé",
    "bar lounge Cameroun",
    "vintage africain",
    "Ékié",
    "cuisine camerounaise",
    "cocktails",
    "live music Yaoundé",
  ],
  openGraph: {
    title: "LA CACHETTE — Vintage Africain · Ékié, Yaoundé",
    description:
      "Un écrin secret au cœur de Yaoundé. Gastronomie camerounaise, cocktails signature et soirées live dans une ambiance bois, bambou et lumière ambrée.",
    type: "website",
    locale: "fr_CM",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black-ebony text-ivory-cream">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
