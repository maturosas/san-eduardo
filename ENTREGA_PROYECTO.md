# San Eduardo Design - Documento de Cierre

## Estado general

La web queda lista para entrega funcional al cliente. El proyecto usa Next.js App Router, React, TypeScript, Supabase y Vercel.

Verificaciones realizadas:

```bash
npx tsc --noEmit --incremental false --pretty false
npm run build
```

Ambos comandos pasan correctamente.

## Funcionalidades implementadas

- Home responsive con hero, rubros, nosotros, testimonios, zonas y contacto.
- Header, hero, textos principales, imágenes, contacto y footer editables desde `Admin > Contenido`.
- Catálogo por rubros/categorías.
- Página individual por producto.
- Productos con slug, descripción corta, descripción larga, precio, precio promocional, stock, imagen, badge, título SEO y meta description.
- Agregar productos a “Mi presupuesto”.
- Drawer de presupuesto con cantidades, total estimado y formulario.
- Notificación al agregar productos al presupuesto.
- CTA mobile unificado con presupuesto y WhatsApp.
- Formulario de contacto con anti-spam básico.
- WhatsApp prellenado con URL compatible.
- Blog con listado, artículos individuales, imagen, excerpt y CTA.
- Testimonios editables.
- Configuración de Open Graph, Analytics y contenido del sitio desde admin.
- Importación/exportación CSV de productos por rubro.
- Sitemap, robots, metadata, Open Graph, Twitter cards y schema para negocio, producto, artículos y breadcrumbs.

## Admin

El panel `/admin` permite:

- Ver y gestionar consultas.
- Crear, editar, ocultar y borrar rubros.
- Crear, editar, borrar, importar y exportar productos.
- Subir imágenes a Supabase Storage.
- Crear y editar artículos del blog.
- Crear y editar testimonios.
- Editar contenido general del sitio.
- Configurar datos generales, preview social y analytics.

## Supabase

Tablas principales esperadas:

- `rubros`
- `rubro_items`
- `blog_posts`
- `consultas`
- `site_config`
- `testimonios`

Columnas recomendadas para `rubro_items`:

```sql
alter table public.rubro_items
add column if not exists slug text,
add column if not exists long_description text,
add column if not exists seo_title text,
add column if not exists meta_description text,
add column if not exists price numeric,
add column if not exists promo_price numeric,
add column if not exists stock integer,
add column if not exists image_url text,
add column if not exists badge text default 'En construcción',
add column if not exists active boolean default true,
add column if not exists orden integer default 99;
```

## CSV de productos

Columnas soportadas:

```text
id, rubro_id, rubro_slug, rubro_name, name, slug, description, long_description, seo_title, meta_description, price, promo_price, stock, image_url, badge, active, orden
```

Reglas:

- Si la fila tiene `id`, actualiza ese producto.
- Si no tiene `id`, busca por `slug` dentro del rubro.
- Si no existe, crea un producto nuevo.
- Las imágenes se cargan mediante URL en `image_url`.

## Recomendaciones futuras

- Agregar buscador global de productos.
- Agregar filtros por precio, stock, oferta y rubro.
- Agregar vista general `/productos`.
- Agregar productos relacionados en la página individual.
- Agregar preview de CSV antes de importar.
- Agregar botón “duplicar producto” en admin.
- Mejorar autenticación del admin con usuarios/roles si el cliente tendrá varios operadores.
- Agregar notificaciones automáticas por email si el cliente lo requiere.

## Prompt maestro para futuras webs

```text
Quiero crear una web editable tipo catálogo/presupuesto para un negocio local, usando Next.js App Router, React, TypeScript, Supabase y Vercel.

Stack esperado:
- Next.js App Router con TypeScript.
- Supabase como base de datos y storage de imágenes.
- Vercel para deploy.
- Panel admin interno protegido con contraseña.
- Tailwind/CSS responsive.
- Componentes reutilizables para cards, formularios, CTAs y secciones.

Funcionalidades públicas:
- Home con hero editable.
- Header, menú, footer, textos e imágenes editables desde admin.
- Secciones editables: rubros/categorías, nosotros, zonas, contacto, testimonios.
- Catálogo por categorías/rubros.
- Página individual para cada producto.
- Producto clickeable con URL propia, imagen, precio, precio promocional, stock, badge, descripción corta, descripción larga, título SEO y meta description.
- Botón para agregar producto a “Mi presupuesto”.
- Drawer de presupuesto no invasivo, con productos, cantidades, total estimado y formulario.
- Notificación cuando se agrega un producto.
- CTA mobile unificado con presupuesto y WhatsApp.
- Formulario de contacto con anti-spam básico.
- WhatsApp prellenado.
- Blog con listado, artículo individual, categorías, imagen, excerpt y CTA.
- SEO técnico: sitemap, robots, metadata, Open Graph, Twitter cards, schema LocalBusiness, Product, Article y Breadcrumb.

Funcionalidades admin:
- Login simple.
- CRUD de rubros/categorías.
- CRUD de productos.
- Subida de imágenes a Supabase Storage.
- Importar/exportar productos por CSV por categoría.
- Campos CSV: id, rubro_id, rubro_slug, rubro_name, name, slug, description, long_description, seo_title, meta_description, price, promo_price, stock, image_url, badge, active, orden.
- CRUD de blog.
- CRUD de testimonios.
- Gestión de consultas recibidas.
- Configuración editable del sitio.
- Módulo “Contenido” para editar textos e imágenes principales sin tocar código.

Base de datos mínima:
- rubros: id, name, slug, description, long_description, icon, whatsapp_text, image_url, active, orden, created_at.
- rubro_items: id, rubro_id, name, slug, description, long_description, seo_title, meta_description, price, promo_price, stock, image_url, badge, active, orden.
- blog_posts: id, title, slug, excerpt, content, image_url, category, published, published_at, created_at, updated_at.
- consultas: id, nombre, telefono, email, zona, mensaje, presupuesto_items, estado, created_at.
- site_config: key, label, value, updated_at.
- testimonios: id, nombre, barrio, tipo_obra, texto, estrellas, activo, orden.

Criterios de calidad:
- Mobile first.
- CTAs claros.
- Admin usable por cliente no técnico.
- Fallbacks si Supabase no devuelve contenido.
- Build debe pasar con `npm run build`.
- TypeScript debe pasar con `npx tsc --noEmit --incremental false --pretty false`.
- Evitar hardcodear textos principales cuando puedan ser editables desde admin.
```
