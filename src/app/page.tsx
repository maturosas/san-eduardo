import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Rubros from "@/components/sections/Rubros";
import Marcas from "@/components/sections/Marcas";
import Nosotros from "@/components/sections/Nosotros";
import Zonas from "@/components/sections/Zonas";
import Contacto from "@/components/sections/Contacto";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Rubros />
        <Marcas />
        <Nosotros />
        <Zonas />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
