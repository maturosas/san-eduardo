export type ContentField = {
  key: string;
  label: string;
  group: "Header" | "Hero" | "Rubros" | "Nosotros" | "Testimonios" | "Zonas" | "Contacto" | "Footer";
  type?: "text" | "textarea" | "image";
  value: string;
};

export const CONTENT_FIELDS: ContentField[] = [
  { group: "Header", key: "header_logo_url", label: "Logo del header", type: "image", value: "/images/logo-color.jpg" },
  { group: "Header", key: "nav_rubros_label", label: "Menú: Rubros", value: "Rubros" },
  { group: "Header", key: "nav_nosotros_label", label: "Menú: Nosotros", value: "Nosotros" },
  { group: "Header", key: "nav_zonas_label", label: "Menú: Zona de entrega", value: "Zona de entrega" },
  { group: "Header", key: "nav_contacto_label", label: "Menú: Contacto", value: "Contacto" },
  { group: "Header", key: "nav_cta_label", label: "Botón principal del menú", value: "Pedir presupuesto" },

  { group: "Hero", key: "hero_image_1", label: "Hero imagen 1", type: "image", value: "/images/showroom.jpg" },
  { group: "Hero", key: "hero_image_2", label: "Hero imagen 2", type: "image", value: "/images/construccion.jpg" },
  { group: "Hero", key: "hero_eyebrow", label: "Hero etiqueta", value: "San Eduardo Design · Desde 1964" },
  { group: "Hero", key: "hero_headline_1", label: "Hero título 1", value: "TODO LO QUE|TU OBRA|NECESITA." },
  { group: "Hero", key: "hero_subtitle_1", label: "Hero texto 1", type: "textarea", value: "Más de 15.000 artículos en stock. Marcas líderes. Asesoramiento real de quienes conocen el rubro." },
  { group: "Hero", key: "hero_headline_2", label: "Hero título 2", value: "60 AÑOS|CONSTRUYENDO|LA ZONA SUR." },
  { group: "Hero", key: "hero_subtitle_2", label: "Hero texto 2", type: "textarea", value: "Tres generaciones al servicio de arquitectos, constructores y propietarios del GBA Sur." },
  { group: "Hero", key: "hero_primary_cta", label: "Hero botón principal", value: "Pedir presupuesto" },
  { group: "Hero", key: "hero_secondary_cta", label: "Hero botón secundario", value: "Ver rubros →" },

  { group: "Rubros", key: "rubros_eyebrow", label: "Rubros etiqueta", value: "Lo que encontrás" },
  { group: "Rubros", key: "rubros_title", label: "Rubros título", value: "RUBROS" },
  { group: "Rubros", key: "rubros_description", label: "Rubros descripción", type: "textarea", value: "Todo para construir, reformar o terminar. Hacé clic en cada rubro para ver productos y pedir presupuesto." },

  { group: "Nosotros", key: "nosotros_image", label: "Nosotros imagen", type: "image", value: "/images/construccion.jpg" },
  { group: "Nosotros", key: "nosotros_eyebrow", label: "Nosotros etiqueta", value: "Quiénes somos" },
  { group: "Nosotros", key: "nosotros_title", label: "Nosotros título", value: "MÁS DE 60 AÑOS|EN LA ZONA SUR." },
  { group: "Nosotros", key: "nosotros_lead", label: "Nosotros destacado", type: "textarea", value: "San Eduardo Design nació en Temperley en 1964 y nunca se fue." },
  { group: "Nosotros", key: "nosotros_text_1", label: "Nosotros texto 1", type: "textarea", value: "Lo que empezó como un pequeño corralón familiar se convirtió en el referente de la zona sur para constructores, arquitectos y particulares." },
  { group: "Nosotros", key: "nosotros_text_2", label: "Nosotros texto 2", type: "textarea", value: "Hoy contamos con más de 7.500 m² de depósito, 15.000 artículos en stock y un equipo que conoce cada producto que vendemos." },

  { group: "Testimonios", key: "testimonios_eyebrow", label: "Testimonios etiqueta", value: "Lo que dicen nuestros clientes" },
  { group: "Testimonios", key: "testimonios_title", label: "Testimonios título", value: "CLIENTES QUE CONSTRUYERON|CON NOSOTROS." },

  { group: "Zonas", key: "zonas_eyebrow", label: "Zonas etiqueta", value: "Dónde llegamos" },
  { group: "Zonas", key: "zonas_title", label: "Zonas título", value: "ZONA DE|ENTREGA." },
  { group: "Zonas", key: "zonas_description", label: "Zonas descripción", type: "textarea", value: "Hacemos entregas en todo el GBA Sur con fletes propios. Coordinamos el horario con vos. Para obras grandes, consultá condiciones especiales." },
  { group: "Zonas", key: "zonas_list", label: "Zonas lista, separadas por coma", type: "textarea", value: "Temperley, Lomas de Zamora, Banfield, Adrogué, Lanús, Quilmes, Almirante Brown, Bernal, Wilde, Avellaneda, Berazategui, Florencio Varela, Monte Grande, San Justo, La Plata, Ezeiza" },

  { group: "Contacto", key: "contacto_eyebrow", label: "Contacto etiqueta", value: "Hablemos" },
  { group: "Contacto", key: "contacto_title", label: "Contacto título", value: "PEDÍ TU PRESUPUESTO." },
  { group: "Contacto", key: "contacto_description", label: "Contacto descripción", type: "textarea", value: "Dejanos tus datos y te respondemos en el día." },

  { group: "Footer", key: "footer_logo_url", label: "Logo del footer", type: "image", value: "/images/logo-color.jpg" },
  { group: "Footer", key: "footer_description", label: "Footer descripción", type: "textarea", value: "Corralón de materiales de construcción en Temperley.\nMás de 60 años al servicio del GBA Sur." },
  { group: "Footer", key: "footer_credit_label", label: "Crédito footer", value: "by - agenciaboutique" },
  { group: "Footer", key: "footer_credit_url", label: "Link crédito footer", value: "https://agencia-plan.vercel.app/" },
];

export const CONTENT_DEFAULTS = Object.fromEntries(CONTENT_FIELDS.map(field => [field.key, field.value]));

export type SiteContent = Record<string, string>;
