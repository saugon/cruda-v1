import { BASE } from "../lib/paths";

// Datos transcriptos de las fichas de resouces/cruda-haus.pdf (Catálogo Mayorista, actualización 2026).
// `ficha` es la página del PDF. `etiqueta` es la categoría numerada tal cual figura en cada ficha.
// `peso`, `texto`, `medida` y `vegano` solo existen cuando la ficha los trae.
// `sinConservantes: false` marca las fichas que NO traen el sello "SIN CONSERVANTES" (hoy solo la 27).

export interface Product {
  ficha: number;
  slug: string;
  nombre: string;
  etiqueta: string;
  peso?: string;
  texto?: string;
  medida?: string;
  vegano?: boolean;
  sinConservantes?: boolean;
}

export interface Category {
  slug: string;
  nombre: string;
  productos: Product[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "laminados",
    nombre: "Laminados",
    productos: [
      { ficha: 5, slug: "croissant", nombre: "Croissant", etiqueta: "03. Laminados", peso: "100gr" },
      { ficha: 6, slug: "medialuna", nombre: "Medialuna", etiqueta: "03. Laminados", peso: "90gr" },
      { ficha: 7, slug: "medialuna-tiny", nombre: "Medialuna tiny", etiqueta: "03. Laminados", peso: "60gr" },
      { ficha: 8, slug: "pan-de-chocolate", nombre: "Pan de chocolate", etiqueta: "03. Laminados" },
      { ficha: 9, slug: "danesa", nombre: "Danesa", etiqueta: "03. Laminados", peso: "100gr", texto: "Se entrega sin topping.", medida: "8 cm" },
      { ficha: 10, slug: "roll-de-canela", nombre: "Roll de canela", etiqueta: "03. Laminados", texto: "Con frosting." },
    ],
  },
  {
    slug: "chipa",
    nombre: "Chipa",
    productos: [
      { ficha: 11, slug: "chipa-clasico", nombre: "Chipa clásico", etiqueta: "03. Chipa", peso: "90gr", texto: "100% fécula de mandioca con queso pategrás y parmesano." },
      { ficha: 12, slug: "chipa-para-sandwich", nombre: "Chipa para sandwich", etiqueta: "03. Chipa", peso: "180gr", texto: "100% fécula de mandioca con queso pategras y parmesano. Ideal para rellenar." },
    ],
  },
  {
    slug: "panes",
    nombre: "Panes",
    productos: [
      { ficha: 14, slug: "pan-de-semillas", nombre: "Pan de semillas", etiqueta: "01. Panes", texto: "Harina de trigo e integral con semillas de zapallo, avena, lino, sésamo blanco y negro.", medida: "30 cm" },
      { ficha: 15, slug: "pan-lactal", nombre: "Pan lactal", etiqueta: "02. Panes", texto: "Harina de trigo, papa y masa madre.", medida: "30 cm" },
      { ficha: 16, slug: "pan-de-masa-madre", nombre: "Pan de masa madre", etiqueta: "03. Panes", texto: "Harina de trigo e integral con masa madre." },
      { ficha: 17, slug: "pan-de-campo", nombre: "Pan de campo", etiqueta: "03. Panes", texto: "Sin conservantes." },
      { ficha: 18, slug: "pan-brioche", nombre: "Pan brioche", etiqueta: "03. Panes", texto: "Sin conservantes.", vegano: true },
      { ficha: 19, slug: "panes-de-hamburguesa", nombre: "Panes de hamburguesa", etiqueta: "03. Panes", texto: "Sin conservantes." },
    ],
  },
  {
    slug: "alfajores",
    nombre: "Alfajores",
    productos: [
      { ficha: 21, slug: "alfajor-de-almendras", nombre: "Alfajor de almendras", etiqueta: "03. Alfajores", texto: "Masa sablé con harina de almendras." },
      { ficha: 22, slug: "alfajor-de-coco", nombre: "Alfajor de coco", etiqueta: "03. Alfajores", texto: "Alfajor sin harinas con dulce de leche." },
      { ficha: 23, slug: "pepa-bretona-frambuesa", nombre: "Pepa bretona", etiqueta: "03. Alfajores", texto: "Con mermelada de frambuesa casera." },
      { ficha: 24, slug: "pepa-bretona-pistacho", nombre: "Pepa bretona", etiqueta: "03. Alfajores", texto: "Con pistacho y chocolate blanco." },
    ],
  },
  {
    slug: "cookies",
    nombre: "Cookies",
    productos: [
      { ficha: 26, slug: "cookie-carrot-cake", nombre: "Cookie carrot cake", etiqueta: "03. Cookies", texto: "Con crema frosting, semillas de zapallo, nueces y naranja rallada." },
      { ficha: 27, slug: "cookie-triple-chocolate", nombre: "Cookie triple chocolate", etiqueta: "03. Cookies", texto: "Masa de cacao alcalino con chocolate negro y blanco.", sinConservantes: false },
      { ficha: 28, slug: "cookie-vegana", nombre: "Cookie vegana", etiqueta: "03. Cookies", texto: "Con chips de chocolate y avellanas.", vegano: true },
      { ficha: 29, slug: "cookie-pistacho", nombre: "Cookie pistacho", etiqueta: "03. Cookies", texto: "Acompañado por la manga de crema de pistacho para decorar al momento de servir." },
      { ficha: 30, slug: "cookie-red-velvet", nombre: "Cookie red velvet", etiqueta: "03. Cookies" },
    ],
  },
  {
    slug: "budines",
    nombre: "Budines",
    productos: [
      { ficha: 32, slug: "budin-choco-mani-cafe", nombre: "Budin choco y crema de maní y café", etiqueta: "03. Budines" },
      { ficha: 33, slug: "budin-de-calabaza", nombre: "Budín de calabaza", etiqueta: "03. Budines", texto: "Budín vegano de calabaza y especias." },
      { ficha: 34, slug: "budin-de-banana", nombre: "Budín de banana", etiqueta: "03. Budines" },
    ],
  },
  {
    slug: "tortas",
    nombre: "Tortas",
    productos: [
      { ficha: 36, slug: "torta-matilda", nombre: "Torta Matilda", etiqueta: "03. Tortas", texto: "Bizcocho húmedo de cacao. Relleno de ganache Bariloche." },
      { ficha: 37, slug: "torta-de-vainilla-frutilla-y-merengue", nombre: "Torta de vainilla frutilla y merengue", etiqueta: "03. Tortas" },
      { ficha: 38, slug: "key-lime-pie", nombre: "Key lime pie", etiqueta: "03. Tortas", texto: "Rellena de lima y leche condensada con base de sablé y merengue italiano." },
      { ficha: 39, slug: "torta-vasca", nombre: "Torta vasca", etiqueta: "03. Tortas", texto: "Dos alternativas: clásica o con dulce de leche." },
      { ficha: 40, slug: "mini-tarta-de-choco", nombre: "Mini tarta de choco", etiqueta: "03. Tortas", texto: "Clásico cordobés bañado en glasé de limón, relleno de dulce de leche." },
      { ficha: 41, slug: "mini-cake-de-cafe", nombre: "Mini cake de café", etiqueta: "03. Tortas" },
      { ficha: 42, slug: "mini-tarta-de-frutilla", nombre: "Mini tarta de frutilla", etiqueta: "03. Tortas" },
      { ficha: 43, slug: "croissant-rellena-de-crema-de-frutilla", nombre: "Croissant rellena de crema de frutilla", etiqueta: "03. Tortas", texto: "Acompañado por la manga de frutilla para rellenar cada croissant al momento de servir." },
    ],
  },
  {
    slug: "otros",
    nombre: "Otros",
    productos: [
      // La ficha 44 está antes del separador .OTROS en el PDF, pero su etiqueta dice "03. OTROS": manda la etiqueta.
      { ficha: 44, slug: "muffin-crumble", nombre: "Muffin crumble", etiqueta: "03. Otros" },
      { ficha: 46, slug: "granola", nombre: "Granola", etiqueta: "03. Otros", texto: "Avena, semillas de zapallo, avellana, almendras, coco, maní y miel." },
    ],
  },
];

export const ALL_PRODUCTS = CATEGORIES.flatMap((c) => c.productos);

export const hasSeal = (p: Product) => p.sinConservantes !== false;
export const SEALED_COUNT = ALL_PRODUCTS.filter(hasSeal).length;

// Destacados de la landing: uno por categoría (la página /productos muestra todos).
const FEATURED_SLUGS = ["croissant", "chipa-clasico", "pan-de-masa-madre", "alfajor-de-almendras", "cookie-pistacho", "torta-vasca"];
export const FEATURED = FEATURED_SLUGS.map((s) => ALL_PRODUCTS.find((p) => p.slug === s)!);

export const productImage = (p: Product, size: "sm" | "lg" = "lg") =>
  `${BASE}/assets/productos/p${String(p.ficha).padStart(2, "0")}${size === "sm" ? "-sm" : ""}.webp`;

export const productSrcset = (p: Product) => `${productImage(p, "sm")} 520w, ${productImage(p)} 900w`;

// Clientes listados en la ficha "Nuestros partners" (pág. 48). Se omiten "Consumidor final"
// y "Pasteleria", que no son nombres de un local.
export const PARTNERS = [
  "Café 0295", "Calma Chica", "Casa Arcos", "Caversaschi", "Cervus Coffee Shop", "Clorindo", "Croma",
  "Cruce Café", "Grosso Café", "Ibu", "Jauría", "Kaof", "Kenko", "Kike Café", "Kilig", "La Crew",
  "Luogo Café", "Mailo ZN", "Malba", "Meme Coffee", "Meme VL", "Meridiano", "Merlin", "Merope",
  "Mucho Café", "Ok Kafe", "Blessing", "Cake", "Path", "Perro Cafe", "Piola Café", "Pura", "Rincón de Milberg", "Sagrado Café",
  "Salma Café", "Stop & Coffee", "Time Coffee Shop", "Tona French", "Wa Café",
];
