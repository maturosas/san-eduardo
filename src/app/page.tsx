import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Rubros from "@/components/sections/Rubros";
import CTABanner from "@/components/sections/CTABanner";
import Marcas from "@/components/sections/Marcas";
import Nosotros from "@/components/sections/Nosotros";
import Testimonios from "@/components/sections/Testimonios";
import FAQSection from "@/components/sections/FAQSection";
import Zonas from "@/components/sections/Zonas";
import Contacto from "@/components/sections/Contacto";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Rubros />
        <CTABanner />
        <Marcas />
        <Nosotros />
        <Testimonios />
        <FAQSection />
        <Zonas />
        <Contacto />
      </main>
      <Footer />
      <FloatingCTA />
      <StickyMobileCTA />
    </>
  );
}
