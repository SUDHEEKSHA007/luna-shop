import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUNA ACCESSORIES | Haute Joaillerie & Elegant Adornments",
  description: "Discover handcrafted luxury jewelry, freshwater pearls, 18k gold vermeil, and refined accessories designed for timeless grace.",
  keywords: "luxury jewelry, handcrafted accessories, freshwater pearls, gold necklace, rings, bracelets, Luna Accessories",
  openGraph: {
    title: "LUNA ACCESSORIES | Luxury Jewelry & Handcrafted Adornments",
    description: "Timeless elegance & handcrafted luxury everyday pieces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#B8976C]/20 selection:text-[#1C1917]">
        {children}
      </body>
    </html>
  );
}
