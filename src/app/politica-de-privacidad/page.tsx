import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | San Eduardo Design",
  description: "Política de privacidad y tratamiento de datos personales de San Eduardo Design.",
  robots: { index: false, follow: false },
};

export default function PrivacidadPage() {
  const updated = "Abril 2026";
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20" style={{ background: "#F4F8FC" }}>
        <div className="se-container max-w-3xl">
          <Link href="/" className="font-body text-sm text-[#9DAEBF] hover:text-[#0D4A72] transition-colors mb-8 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="font-display mb-2" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#0D4A72", letterSpacing: "0.03em" }}>
            POLÍTICA DE PRIVACIDAD
          </h1>
          <p className="font-body text-sm text-[#9DAEBF] mb-10">Última actualización: {updated}</p>

          <div className="space-y-8 font-body text-[#5A6A7E] leading-relaxed" style={{ fontWeight: 300 }}>
            {[
              {
                title: "1. Responsable del tratamiento",
                content: "San Eduardo Design, con domicilio en Dr. Carlos Collivadino 57, Temperley, Buenos Aires, Argentina. Email de contacto: info@saneduardodesign.com.ar.",
              },
              {
                title: "2. Datos que recopilamos",
                content: "Recopilamos únicamente los datos que el usuario nos proporciona voluntariamente a través del formulario de contacto o el módulo de presupuesto: nombre, teléfono, dirección de correo electrónico, zona de entrega y mensaje. No recopilamos datos sensibles.",
              },
              {
                title: "3. Finalidad del tratamiento",
                content: "Los datos se usan exclusivamente para: (a) responder consultas y elaborar presupuestos solicitados por el usuario, (b) coordinar entregas cuando se concrete una compra, (c) mejorar la experiencia del sitio web mediante herramientas de analítica anónima.",
              },
              {
                title: "4. Base legal",
                content: "El tratamiento de datos se basa en el consentimiento del usuario al completar el formulario, y en la ejecución de un contrato o precontrato cuando se solicita un presupuesto.",
              },
              {
                title: "5. Conservación de datos",
                content: "Los datos se conservan durante el tiempo necesario para atender la consulta y por un período adicional de 12 meses para fines de registro. Los datos asociados a compras efectivas se conservan según la normativa contable aplicable.",
              },
              {
                title: "6. Compartición de datos",
                content: "No vendemos ni cedemos datos personales a terceros con fines comerciales. Podemos compartir datos con proveedores de servicios tecnológicos (hosting, base de datos) bajo acuerdos de confidencialidad, exclusivamente para prestar los servicios del sitio.",
              },
              {
                title: "7. Derechos del usuario",
                content: "De acuerdo con la Ley 25.326 de Protección de Datos Personales de Argentina, el titular de los datos tiene derecho a acceder, rectificar, suprimir y oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, contactenos en info@saneduardodesign.com.ar.",
              },
              {
                title: "8. Cookies y analítica",
                content: "El sitio puede utilizar herramientas de analítica web (Google Analytics, Microsoft Clarity) que recopilan datos de navegación de forma anonimizada para mejorar la experiencia del usuario. Estos datos no identifican a personas de forma directa.",
              },
              {
                title: "9. Seguridad",
                content: "Implementamos medidas técnicas y organizativas razonables para proteger los datos personales contra acceso no autorizado, pérdida o destrucción.",
              },
              {
                title: "10. Modificaciones",
                content: "Nos reservamos el derecho de actualizar esta política. Las modificaciones se publicarán en esta misma página con la fecha de actualización.",
              },
            ].map(section => (
              <div key={section.title}>
                <h2 className="font-body font-semibold text-[#0D4A72] mb-2" style={{ fontSize: "15px" }}>{section.title}</h2>
                <p className="text-sm">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
