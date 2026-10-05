# Cruda Haus — landing

Sitio estático con Astro y GSAP/ScrollTrigger:

- `/`: landing (hero, quiénes somos, qué hacemos, productos destacados, partners y cierre con WhatsApp).
- `/productos`: catálogo completo, con las 36 fichas agrupadas por categoría.

## Correr en local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/ (estático, listo para Vercel o Netlify)
npm run preview    # sirve dist/
```

## Publicar en GitHub Pages

El workflow `.github/workflows/deploy.yml` (en la raíz del repo) compila `web/` y lo publica. Es manual: no corre con los push.

1. En el repo: **Settings → Pages → Source: GitHub Actions** (una sola vez).
2. **Actions → Deploy a GitHub Pages → Run workflow** (elegís la rama, por defecto `main`). El sitio queda en `https://<usuario>.github.io/<repo>/`.

Desde la terminal: `gh workflow run deploy.yml --ref main`.

El workflow le pasa a Astro la URL y la ruta base (`SITE_URL`, `BASE_PATH`). Todas las rutas internas usan `src/lib/paths.ts`, así que funcionan bajo `/<repo>/` y también con dominio propio (ahí la base queda en `/`). Para probar localmente como en Pages: `BASE_PATH=/cruda-v1 npm run build`.

`resouces/` no se sube al repo (ver `.gitignore`): pesa ~1 GB, tiene archivos de más de 100 MB y las fuentes SF Pro no se pueden redistribuir.

También funciona en Vercel o Netlify: comando de build `npm run build`, carpeta de salida `dist`.

## Dónde editar

- **WhatsApp, mensaje prearmado e Instagram**: `src/config.ts` (son placeholders).
- **Productos**: `src/data/products.ts`, transcriptos de `../resouces/cruda-haus.pdf`. Los destacados de la landing salen de `FEATURED_SLUGS` en ese mismo archivo.
- **Textos**: en cada componente de `src/components/` (salen del Proposal 2.0, el Toolkit y el poster manifiesto).

## Activos

Todo lo de `public/assets/` sale de `../resouces/` (que no se modifica):

- Logos vectoriales: `CH-Logos.ai` → SVG (el texto ya viene en curvas, no usan fuente).
- Logos con efecto, fotos, pattern Papel Manteca y perfiles de RRSS → WebP.
- Productos: foto de cada ficha del PDF, recortada (recorte de sujeto de macOS Vision; la Pepa bretona de pistacho, con máscara por saturación), centrada en un cuadrado igual para todos.

`scripts/build_assets.py` documenta y repite la conversión (necesita Python con pymupdf, pillow, numpy y scipy, más ImageMagick y cwebp; no son dependencias del sitio).

## Tipografía

SF Pro Rounded no se puede incrustar en la web. Se usa **M PLUS Rounded 1c** (OFL), autoalojada en `public/fonts/` (subset latin). No se sirve ningún archivo de SF Pro.

## Movimiento y accesibilidad

- El HTML y el CSS base son el layout completo sin animación. Cada sección se pasa a su layout animado solo si el JS la arma bien (`data-motion="on"`); si falla, vuelve sola al layout estático.
- Con "reducir movimiento" no se arma ninguna animación atada al scroll y el marquee de partners queda quieto. Con una ventana de menos de 520 px de alto (celular acostado) tampoco se arman las animaciones de scroll: las secciones fijas no entran.
- Al rotar, cambiar el tamaño o recalcular, se conserva la sección (y la proporción dentro de ella) donde estaba el usuario.

## Notas del catálogo (se respetó lo que dice cada ficha)

- Panes: la ficha de Pan de semillas dice "01. PANES", la de Pan lactal "02. PANES" y el resto "03. PANES". Las demás categorías dicen "03.".
- Muffin crumble está antes del separador ".OTROS" en el PDF, pero su etiqueta dice "03. OTROS": se muestra en Otros.
- Hay dos fichas "PEPA BRETONA" (frambuesa y pistacho).
- La ficha de "Cookie triple chocolate" no trae el sello "SIN CONSERVANTES": en la web tampoco (35 de 36 lo llevan).
- La descripción de "Mini tarta de choco" en el PDF es "Clásico cordobés bañado en glasé de limón, relleno de dulce de leche".
- Medialuna y Medialuna tiny usan la misma foto en el PDF.
