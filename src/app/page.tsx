import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Rubros from "@/components/sections/Rubros";
import Nosotros from "@/components/sections/Nosotros";
import Testimonios from "@/components/sections/Testimonios";
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
        <Nosotros />
        <Testimonios />
        <Zonas />
        <Contacto />
      </main>
      <Footer />
      <FloatingCTA />
      <StickyMobileCTA />
    </>
  );
}
