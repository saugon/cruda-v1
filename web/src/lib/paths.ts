// Prefija rutas internas con la base del sitio (en GitHub Pages el sitio vive en /<repo>/).
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
export const url = (path: string) => `${BASE}${path}`;
