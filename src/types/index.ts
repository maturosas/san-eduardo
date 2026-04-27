export type Rubro = {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  icon: string;
  whatsapp_text: string;
  image_url: string | null;
  active: boolean;
  orden: number;
  created_at: string;
};

export type RubroItem = {
  id: string;
  rubro_id: string;
  name: string;
  slug: string | null;
  description: string;
  long_description: string | null;
  seo_title: string | null;
  meta_description: string | null;
  price: number | null;
  promo_price: number | null;
  image_url: string | null;
  badge: string;
  active: boolean;
  orden: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  category: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteConfig = {
  key: string;
  label: string;
  value: string;
};

export type Consulta = {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string;
  zona: string | null;
  mensaje: string;
  estado: "nueva" | "en_contacto" | "resuelta";
  presupuesto_items: string | null;
  created_at: string;
};
