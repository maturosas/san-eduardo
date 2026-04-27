const DEFAULT_NUMBER = "5491121613339";

export function getWhatsAppUrl(texto: string, numero: string = DEFAULT_NUMBER): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function getWhatsAppUrlByRubro(rubro: string, numero: string = DEFAULT_NUMBER): string {
  return getWhatsAppUrl(`Hola, quiero cotizar ${rubro} para mi obra. ¿Pueden asesorarme?`, numero);
}
