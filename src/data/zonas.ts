export interface Zona {
  name: string;
  slug: string;
  partido: string;
  lat: number;
  lng: number;
  km: number;
  desc: string;
  keywords: string[];
}

export const ZONAS: Zona[] = [
  { name: "Temperley", slug: "temperley", partido: "Lomas de Zamora", lat: -34.7803, lng: -58.3979, km: 0, desc: "Nuestra sede principal. Podés pasar a retirar sin costo adicional o coordinamos entrega directa a tu obra.", keywords: ["corralón Temperley", "materiales construcción Temperley"] },
  { name: "Lomas de Zamora", slug: "lomas-de-zamora", partido: "Lomas de Zamora", lat: -34.7638, lng: -58.4003, km: 3, desc: "Entrega en todo Lomas de Zamora con flete propio. Coordinamos horario con vos según disponibilidad de obra.", keywords: ["corralón Lomas de Zamora", "materiales construcción Lomas de Zamora"] },
  { name: "Banfield", slug: "banfield", partido: "Lomas de Zamora", lat: -34.7447, lng: -58.4006, km: 4, desc: "Llegamos a Banfield en el día para pedidos realizados antes de las 10hs. Materiales gruesos y terminaciones.", keywords: ["corralón Banfield", "materiales construcción Banfield"] },
  { name: "Adrogué", slug: "adrogue", partido: "Almirante Brown", lat: -34.7991, lng: -58.3916, km: 3, desc: "Cobertura completa en Adrogué y Don Orione. Flete a obra o domicilio, coordinado con el cliente.", keywords: ["corralón Adrogué", "materiales construcción Adrogué"] },
  { name: "Lanús", slug: "lanus", partido: "Lanús", lat: -34.7086, lng: -58.3897, km: 10, desc: "Entrega a todo el partido de Lanús: Lanús Este, Lanús Oeste, Remedios de Escalada y Monte Chingolo.", keywords: ["corralón Lanús", "materiales construcción Lanús"] },
  { name: "Quilmes", slug: "quilmes", partido: "Quilmes", lat: -34.7199, lng: -58.2540, km: 15, desc: "Llegamos a Quilmes centro, Bernal y Don Bosco. Para obras grandes consultá condiciones especiales de flete.", keywords: ["corralón Quilmes", "materiales construcción Quilmes"] },
  { name: "Almirante Brown", slug: "almirante-brown", partido: "Almirante Brown", lat: -34.8369, lng: -58.3964, km: 7, desc: "Cobertura en Burzaco, Longchamps, Claypole, Malvinas Argentinas y José Mármol. Flete propio a obra.", keywords: ["corralón Almirante Brown", "materiales construcción Almirante Brown"] },
  { name: "Bernal", slug: "bernal", partido: "Quilmes", lat: -34.7075, lng: -58.2881, km: 13, desc: "Entrega a domicilio y a obra en Bernal, Bernal Oeste y Villa del Parque. Coordinamos por WhatsApp.", keywords: ["corralón Bernal", "materiales construcción Bernal"] },
  { name: "Wilde", slug: "wilde", partido: "Avellaneda", lat: -34.6986, lng: -58.3225, km: 16, desc: "Servicio de entrega en Wilde y Sarandí. Materiales de construcción con flete coordinado.", keywords: ["corralón Wilde", "materiales construcción Wilde"] },
  { name: "Avellaneda", slug: "avellaneda", partido: "Avellaneda", lat: -34.6650, lng: -58.3654, km: 18, desc: "Llegamos a Avellaneda con coordinación previa. Ideal para obras medianas y grandes de la zona.", keywords: ["corralón Avellaneda", "materiales construcción Avellaneda"] },
  { name: "Berazategui", slug: "berazategui", partido: "Berazategui", lat: -34.7636, lng: -58.2099, km: 18, desc: "Entrega en Berazategui, Hudson y Plátanos. Para pedidos de volumen, consultá precios especiales.", keywords: ["corralón Berazategui", "materiales construcción Berazategui"] },
  { name: "Florencio Varela", slug: "florencio-varela", partido: "Florencio Varela", lat: -34.8086, lng: -58.2758, km: 14, desc: "Cobertura en Florencio Varela centro y Villa San Luis. Flete disponible bajo pedido.", keywords: ["corralón Florencio Varela", "materiales construcción Florencio Varela"] },
  { name: "Monte Grande", slug: "monte-grande", partido: "Esteban Echeverría", lat: -34.8226, lng: -58.4713, km: 10, desc: "Llegamos a Monte Grande, Canning y 9 de Abril. Coordinamos entrega según disponibilidad.", keywords: ["corralón Monte Grande", "materiales construcción Monte Grande"] },
  { name: "San Justo", slug: "san-justo", partido: "La Matanza", lat: -34.6831, lng: -58.5589, km: 25, desc: "Entregas a San Justo y Ramos Mejía para obras de volumen. Consultanos antes de cotizar el flete.", keywords: ["corralón San Justo", "materiales construcción San Justo"] },
  { name: "La Plata", slug: "la-plata", partido: "La Plata", lat: -34.9204, lng: -57.9534, km: 35, desc: "Entregamos en La Plata para obras de gran volumen. Consultá condiciones especiales y mínimo de compra.", keywords: ["corralón La Plata", "materiales construcción La Plata"] },
  { name: "Ezeiza", slug: "ezeiza", partido: "Ezeiza", lat: -34.8534, lng: -58.5220, km: 20, desc: "Cobertura en Ezeiza y Canning con coordinación previa. Materiales gruesos y terminaciones.", keywords: ["corralón Ezeiza", "materiales construcción Ezeiza"] },
];

export function getZona(slug: string): Zona | undefined {
  return ZONAS.find(z => z.slug === slug);
}
