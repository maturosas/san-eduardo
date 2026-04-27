import type { Metadata } from "next";
import { Bebas_Neue, Barlow } from "next/font/google";
import "./globals.css";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import Providers from "@/components/Providers";
import PresupuestoDrawer from "@/components/PresupuestoDrawer";
import { serverClient } from "@/lib/supabase";

const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Barlow({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let ogTitle = "San Eduardo Design | Corralón en Temperley, GBA Sur";
  let ogDesc = "Más de 60 años proveyendo materiales de construcción. Cerámicas, sanitarios, hierro, cemento y más. Entrega en todo el GBA Sur desde Temperley.";
  let ogImage = "https://san-eduardo.vercel.app/images/og-san-eduardo.jpg?v=2";

  try {
    const db = serverClient();
    const { data } = await db
      .from("site_config")
      .select("key,value")
      .in("key", ["og_title", "og_description", "og_image_url"]);
    const cfg = Object.fromEntries((data || []).map((r: { key: string; value: string }) => [r.key, r.value?.trim()]));
    if (cfg.og_title) ogTitle = cfg.og_title;
    if (cfg.og_description) ogDesc = cfg.og_description;
    if (cfg.og_image_url) ogImage = cfg.og_image_url;
  } catch { /* use defaults */ }

  return {
    title: ogTitle,
    description: "Corralón y materiales de construcción en Temperley desde 1964. Más de 15.000 artículos, marcas líderes, asesoramiento personalizado y entrega en toda la zona sur.",
    keywords: ["corralón Temperley","materiales construcción zona sur","corralón Lomas de Zamora","materiales construcción GBA Sur","corralón Banfield","San Eduardo Design"],
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: "https://saneduardodesign.com.ar",
      siteName: "San Eduardo Design",
      locale: "es_AR",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "San Eduardo Design — Corralón Temperley" }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: "https://saneduardodesign.com.ar" },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "San Eduardo Design",
  description: "Corralón y materiales de construcción en Temperley desde 1964. Más de 15.000 artículos, marcas líderes y entrega en todo el GBA Sur.",
  url: "https://saneduardodesign.com.ar",
  telephone: ["+54-11-4264-4848", "+54-11-4264-7638"],
  email: "info@saneduardodesign.com.ar",
  foundingDate: "1964",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dr. Carlos Collivadino 57",
    addressLocality: "Temperley",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  geo: { "@type": "GeoCoordinates", latitude: -34.7803, longitude: -58.3979 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "07:30", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "07:30", closes: "13:00" },
  ],
  sameAs: ["https://instagram.com/corralonsaneduardo", "https://facebook.com/corralonsaneduardo"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <AnalyticsScripts />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <PresupuestoDrawer />
        </Providers>
      </body>
    </html>
  );
}
