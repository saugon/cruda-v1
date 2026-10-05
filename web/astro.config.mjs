import { defineConfig } from "astro/config";

// Sitio 100% estático: `npm run build` genera dist/.
// En GitHub Pages el sitio vive en https://<usuario>.github.io/<repo>/: el workflow pasa
// SITE_URL y BASE_PATH. En local (y con dominio propio) la base es "/".
export default defineConfig({
  output: "static",
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || "/",
  build: { inlineStylesheets: "auto" },
});
