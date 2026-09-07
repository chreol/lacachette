import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Cachette | Restaurant Bar Lounge à Yaoundé, Cameroun",
  description:
    "La Cachette est un restaurant-bar lounge à Yaoundé (Cameroun) avec une ambiance vintage au design africain.",
  keywords: [
    "nextjs",
    "typescript",
    "tailwindcss",
    "restaurant",
    "bar",
    "yaounde",
    "cameroon",
    "vintage",
    "african-design",
    "restaurant-website",
    "lounge",
    "seo",
  ],
  openGraph: {
    title: "La Cachette | Vintage African Lounge à Yaoundé",
    description:
      "Découvrez La Cachette, restaurant-bar lounge au style vintage africain à Yaoundé.",
    locale: "fr_CM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
