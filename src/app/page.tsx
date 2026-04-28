import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Rubros from "@/components/sections/Rubros";
import Nosotros from "@/components/sections/Nosotros";
import Testimonios from "@/components/sections/Testimonios";
import Zonas from "@/components/sections/Zonas";
import Contacto from "@/components/sections/Contacto";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { getSiteContent } from "@/lib/siteContent";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <Navbar />
      <main>
        <Hero content={content} />
        <Rubros content={content} />
        <Nosotros content={content} />
        <Testimonios content={content} />
        <Zonas content={content} />
        <Contacto content={content} />
      </main>
      <Footer content={content} />
      <FloatingCTA />
    </>
  );
}
