export interface Testimonio {
  nombre: string;
  barrio: string;
  tipoObra: string;
  texto: string;
  fecha: string;
  estrellas: number;
}

export const TESTIMONIOS: Testimonio[] = [
  {
    nombre: "María López",
    barrio: "Banfield",
    tipoObra: "Refacción de baño",
    texto: "Renovamos el baño completo y conseguimos todo en San Eduardo. El asesoramiento fue clave: nos ayudaron a elegir el porcellanato justo para el espacio. El precio fue muy competitivo y el flete llegó puntual. Los recomiendo sin dudar.",
    fecha: "Marzo 2026",
    estrellas: 5,
  },
  {
    nombre: "Carlos Rodríguez",
    barrio: "Adrogué",
    tipoObra: "Construcción de casa",
    texto: "Construimos la casa desde cero y San Eduardo fue nuestro proveedor principal durante casi un año. Desde los hierros y el cemento hasta las cerámicas y los sanitarios. Siempre tuvieron el stock que necesitábamos y la atención fue excelente.",
    fecha: "Febrero 2026",
    estrellas: 5,
  },
  {
    nombre: "Alejandro Pereyra",
    barrio: "Lomas de Zamora",
    tipoObra: "Ampliación y losa",
    texto: "Hicimos una ampliación de 40m². Compramos todos los materiales gruesos acá: cemento, hierro, ladrillos y cal. El precio mayorista fue lo que buscábamos y el trato muy directo. Ya es la tercera vez que vengo a San Eduardo para obras.",
    fecha: "Enero 2026",
    estrellas: 5,
  },
  {
    nombre: "Patricia Gómez",
    barrio: "Quilmes",
    tipoObra: "Reforma de cocina",
    texto: "Reformé la cocina entera: cerámicas, pileta, griferías y pintura. Todo lo conseguí acá. Lo que más valoro es que te explican la diferencia entre los productos y no te venden lo más caro, sino lo que realmente necesitás. Muy buena experiencia.",
    fecha: "Enero 2026",
    estrellas: 5,
  },
  {
    nombre: "Ricardo Martínez",
    barrio: "Almirante Brown",
    tipoObra: "Impermeabilización de techo",
    texto: "Busqué el impermeabilizante en varios lados y acá no solo tenían el mejor precio sino que me explicaron exactamente cómo aplicarlo. El producto funcionó perfecto, el techo no filtró más. Sin dudas vuelvo para la próxima obra.",
    fecha: "Diciembre 2025",
    estrellas: 5,
  },
  {
    nombre: "Silvia Fernández",
    barrio: "Lanús",
    tipoObra: "Pintura interior de casa",
    texto: "Pinté toda la casa — seis ambientes — con las pinturas que me recomendaron acá. El tintométrico fue un detalle que no esperaba: me hicieron el color exacto que yo quería. Muy recomendable para quien quiere calidad sin pagar de más.",
    fecha: "Noviembre 2025",
    estrellas: 5,
  },
];
