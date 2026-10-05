// Cambia la versión del header (y del logo) según el fondo de la sección que tiene debajo.
// No depende de GSAP: funciona igual con "reducir movimiento" o si falla la animación.
const header = document.querySelector<HTMLElement>(".site-header");
const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-header]"));

if (header && zones.length) {
  let queued = false;
  const update = () => {
    queued = false;
    const probe = header.offsetHeight / 2;
    let theme = "light";
    for (const z of zones) {
      const r = z.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) theme = z.dataset.header || theme; // la más interna gana
    }
    if (header.dataset.theme !== theme) header.dataset.theme = theme;
  };
  const queue = () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  update();
}
