// Animaciones atadas al scroll (GSAP + ScrollTrigger).
//
// Reglas de seguridad:
// - El HTML/CSS base es el layout estático completo. Nada arranca oculto por CSS.
// - Cada sección se arma por separado: se marca con data-motion="on" (activa su layout animado)
//   y, si algo falla al armarla, se revierte y vuelve al layout estático sin afectar a las demás.
// - Con "reducir movimiento" no se arma nada.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window { __chMotion?: boolean }
}

gsap.registerPlugin(ScrollTrigger);
// La barra de direcciones de iOS cambia el alto al scrollear: no recalcular por eso.
ScrollTrigger.config({ ignoreMobileResize: true });

type Cleanup = () => void;
/** `onCleanup` se registra ANTES de tocar estilos a mano: corre al desmontar y también si el armado falla. */
type Env = { desktop: boolean; onCleanup: (fn: Cleanup) => void };
type Builder = (el: HTMLElement, env: Env) => Cleanup | void;

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode) => Array.from(root.querySelectorAll<T>(sel));
const need = <T>(x: T | null | undefined, what: string): T => {
  if (x == null) throw new Error(`motion: falta ${what}`);
  return x;
};
// Alto de referencia estable: 100svh no cambia cuando la barra de iOS se esconde o aparece,
// así los largos de las secciones fijas no varían entre un refresh y otro.
const svhProbe = document.createElement("div");
svhProbe.setAttribute("aria-hidden", "true");
svhProbe.style.cssText = "position:fixed;left:0;top:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none";
document.body.appendChild(svhProbe);
const vh = () => svhProbe.offsetHeight || window.innerHeight;
const pad = (n: number) => String(n).padStart(2, "0");

/* ───────────────────────── HERO ─────────────────────────
   Arranca con el logo gigante y el croissant enorme. Con el scroll el logo se va, el croissant
   gira y se ubica arriba, y el claim se arma en el medio con la etiqueta del packaging abajo. */
const hero: Builder = (el, { desktop }) => {
  const pin = need($(".hero__pin", el), "hero__pin");
  const logo = need($(".hero__logo", el), "hero__logo");
  const stage = need($(".hero__stage", el), "hero__stage");
  const product = need($(".hero__product", el), "hero__product");
  const floats = $$(".hero__float", el);
  const lines = $$(".hero__line", el);
  const rule = $(".hero__rule", el);
  const labelItems = $$(".hero__lead, .hero__mid, .hero__cta", el);
  const hint = $(".hero__hint", el);
  const header = document.querySelector<HTMLElement>(".site-header");

  // Entrada por tiempo (sobre los <img> internos, para no pisar las transformaciones del scroll)
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero__logo-img", { clipPath: "inset(0% 0% 100% 0%)", yPercent: 18, duration: 1.1 })
    .from(".hero__product-img", { yPercent: -60, rotation: -120, scale: 0.6, duration: 1.3, ease: "back.out(1.3)" }, 0.15)
    .from(".hero__float-img", { scale: 0, rotation: (i: number) => (i % 2 ? 90 : -90), duration: 0.9, stagger: 0.08, ease: "back.out(1.8)" }, 0.5);

  const finalSize = () => Math.min(vh() * 0.38, window.innerWidth * 0.7);
  const finalCenter = () => (header?.offsetHeight ?? 60) + vh() * 0.03 + finalSize() / 2;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: el, pin, start: "top top", end: () => `+=${vh() * 1.7}`, scrub: 0.6, invalidateOnRefresh: true },
  });
  tl.to(logo, { yPercent: -60, scale: 0.8, autoAlpha: 0, duration: 0.35, ease: "power1.in" }, 0)
    .to(stage, {
      y: () => finalCenter() - (stage.offsetTop + stage.offsetHeight / 2),
      scale: () => finalSize() / stage.offsetHeight,
      duration: 0.6, ease: "power2.inOut",
    }, 0.05)
    .to(product, { rotation: -200, duration: 1 }, 0)
    .to(floats, {
      x: (i: number) => (i % 2 ? 1 : -1) * window.innerWidth * (desktop ? 0.42 : 0.5),
      y: (i: number) => (i < 2 ? -1 : 1) * vh() * 0.35,
      rotation: (i: number) => (i % 2 ? 160 : -160),
      scale: 1.6, autoAlpha: 0, duration: 0.5,
    }, 0);
  lines.forEach((ln, i) => {
    tl.fromTo(ln, { x: () => (i % 2 ? 1 : -1) * window.innerWidth * 0.6, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" }, 0.4 + i * 0.1);
  });
  if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.out" }, 0.7);
  tl.fromTo(labelItems, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.25, ease: "power2.out" }, 0.78);
  if (hint) tl.to(hint, { autoAlpha: 0, duration: 0.1 }, 0);
};

/* ───────────────────────── QUIÉNES SOMOS ─────────────────────────
   El manifiesto frase por frase (siempre una sola, completa y legible), con una foto por frase. */
const about: Builder = (el, { desktop }) => {
  const pin = need($(".about__pin", el), "about__pin");
  const phrases = $$(".about__phrase", el);
  const photos = $$(".about__photo", el);
  const galgo = $(".about__galgo", el);
  const n = phrases.length;
  if (!n) throw new Error("motion: manifiesto vacío");

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: el, pin, start: "top top", end: () => `+=${vh() * 0.6 * n}`, scrub: 0.5, invalidateOnRefresh: true },
  });
  phrases.forEach((ph, i) => {
    if (i > 0) tl.fromTo(ph, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.25, ease: "power2.out" }, i - 0.05);
    if (i < n - 1) tl.to(ph, { autoAlpha: 0, yPercent: -30, duration: 0.2, ease: "power1.in" }, i + 0.75);
  });
  photos.forEach((ph, i) => {
    const rot = (i % 2 ? 1 : -1) * (3 + (i % 3) * 2);
    if (i === 0) {
      tl.fromTo(ph, { rotation: rot * 2, scale: 0.85 }, { rotation: rot, scale: 1, duration: 0.5 }, 0);
    } else {
      // En celular las fotos entran por los costados para no pasar por encima de la frase.
      const from = desktop ? { y: () => vh() } : { xPercent: i % 2 ? 170 : -170 };
      tl.fromTo(ph, { ...from, rotation: rot * 3 }, { xPercent: 0, y: 0, rotation: rot, duration: 0.35, ease: "power2.out" }, i - 0.1);
    }
  });
  // El galgo mira a la izquierda: corre de derecha a izquierda.
  if (galgo) tl.fromTo(galgo, { x: () => el.clientWidth + 20 }, { x: () => -galgo.offsetWidth - 20, duration: n }, 0);
};

/* ───────────────────────── QUÉ HACEMOS ─────────────────────────
   Sin pin: la foto se abre y se acomoda al entrar (en escritorio queda fija con sticky),
   y el título y cada fila de la hoja aparecen a medida que pasan. */
const what: Builder = (el) => {
  const media = need($(".what__media", el), "what__media");
  const img = need($(".what__media img", el), "what__media img");
  const titleItems = $$(".what__title > *", el);
  const rows = $$(".info-row", el);
  const sheetRows = $$(".sheet__row", el);

  gsap.fromTo(media, { clipPath: "inset(14% 14% 14% 14%)" }, {
    clipPath: "inset(0% 0% 0% 0%)", ease: "none",
    scrollTrigger: { trigger: el, start: "top 85%", end: "top 15%", scrub: 0.5 },
  });
  gsap.fromTo(img, { scale: 1.3, rotation: -3 }, {
    scale: 1, rotation: 0, ease: "none",
    scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.5 },
  });
  titleItems.forEach((it) => {
    gsap.fromTo(it, { autoAlpha: 0, y: 40 }, {
      autoAlpha: 1, y: 0, ease: "power2.out",
      scrollTrigger: { trigger: it, start: "top 92%", end: "top 70%", scrub: 0.5 },
    });
  });
  [...sheetRows, ...rows].forEach((row) => {
    gsap.fromTo(row, { autoAlpha: 0, x: -30 }, {
      autoAlpha: 1, x: 0, ease: "power2.out",
      scrollTrigger: { trigger: row, start: "top 95%", end: "top 75%", scrub: 0.5 },
    });
  });
};

/* ───────────────────────── PRODUCTOS: intro y accesos ───────────────────────── */
const intro: Builder = (el) => {
  const tiles = $$(".cat-index__item", el);
  const title = $(".products__title", el);
  if (title) {
    gsap.fromTo(title, { yPercent: 40, autoAlpha: 0 }, {
      yPercent: 0, autoAlpha: 1, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", end: "top 35%", scrub: 0.5 },
    });
  }
  if (tiles.length) {
    gsap.fromTo(tiles, { y: 80, rotation: (i: number) => (i % 2 ? 6 : -6), autoAlpha: 0 }, {
      y: 0, rotation: 0, autoAlpha: 1, stagger: 0.06, ease: "power2.out",
      scrollTrigger: { trigger: $(".cat-index", el) ?? el, start: "top 92%", end: "top 40%", scrub: 0.5 },
    });
  }
};

/* ───────────────────────── PRODUCTOS: escenario de destacados ─────────────────────────
   Escenario fijo con una "rueda": el scroll la hace girar, el producto activo queda al centro
   y su ficha se muestra al lado. */
const category: Builder = (el, { desktop, onCleanup }) => {
  const stage = need($(".cat__stage", el), "cat__stage");
  const items = $$(".ficha", stage);
  const photos = items.map((it) => need($(".ficha__photo", it), "ficha__photo"));
  const spins = items.map((it) => need($(".ficha__spin", it), "ficha__spin"));
  const infos = items.map((it) => need($(".ficha__info", it), "ficha__info"));
  const counter = $("[data-counter]", stage);
  const thumbs = $$<HTMLButtonElement>(".cat__thumb", stage);
  const n = items.length;
  if (!n) throw new Error("motion: escenario sin productos");

  const state = { p: 0 };
  let st: ScrollTrigger | undefined;
  const onThumb = (e: Event) => {
    const i = Number((e.currentTarget as HTMLElement).dataset.index || 0);
    if (st) window.scrollTo({ top: st.start + (st.end - st.start) * (n > 1 ? i / (n - 1) : 0), behavior: "smooth" });
  };
  // Primero el cleanup: los estilos de la rueda se escriben a mano y GSAP no los revierte solo.
  onCleanup(() => {
    thumbs.forEach((t) => { t.removeEventListener("click", onThumb); t.classList.remove("is-active"); });
    gsap.killTweensOf(state);
    [...photos, ...spins, ...infos].forEach((x) => x.removeAttribute("style"));
    if (counter) counter.textContent = "01";
  });

  // Celular: la rueda gira en horizontal (los vecinos asoman por los costados, arriba de la ficha).
  // Escritorio: gira en vertical, en la columna de la foto, para no pisar la ficha de la derecha.
  let spacing = 0;
  let drop = 0;
  const measure = () => {
    spacing = desktop ? photos[0].offsetHeight * 0.92 : stage.clientWidth * 0.82;
    drop = desktop ? 90 : 36;
  };
  let active = -1;
  const clamp01 = gsap.utils.clamp(0, 1);
  const render = () => {
    for (let i = 0; i < n; i++) {
      const d = i - state.p;
      const ad = Math.abs(d);
      const ph = photos[i].style;
      const op = clamp01(1.6 - ad);
      const along = d * spacing;
      const across = ad * ad * drop;
      const [tx, ty] = desktop ? [-across, along] : [along, across];
      ph.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${(d * 16).toFixed(2)}deg) scale(${(1 - 0.42 * Math.min(ad, 1.2)).toFixed(3)})`;
      ph.opacity = op.toFixed(3);
      ph.visibility = op > 0 ? "visible" : "hidden";
      ph.zIndex = String(Math.round(100 - ad * 10));
      spins[i].style.transform = `rotate(${(d * -50).toFixed(2)}deg)`;
      const io = clamp01(1 - ad * 2.2);
      const inf = infos[i].style;
      inf.opacity = io.toFixed(3);
      inf.visibility = io > 0 ? "visible" : "hidden";
      inf.transform = `translate3d(0, ${(d * 36).toFixed(1)}px, 0)`;
    }
    const a = Math.min(n - 1, Math.max(0, Math.round(state.p)));
    if (a !== active) {
      active = a;
      if (counter) counter.textContent = pad(a + 1);
      thumbs.forEach((t, i) => t.classList.toggle("is-active", i === a));
    }
  };

  const span = Math.max(1, n - 1);
  st = ScrollTrigger.create({
    trigger: stage,
    pin: true,
    start: "top top",
    end: () => `+=${(n > 1 ? (n - 1) * 0.55 : 0.4) * vh()}`,
    invalidateOnRefresh: true,
    snap: n > 1 ? { snapTo: 1 / span, duration: { min: 0.2, max: 0.55 }, delay: 0.08, ease: "power1.inOut" } : undefined,
    onUpdate: (self) => {
      gsap.to(state, { p: self.progress * (n - 1), duration: 0.45, ease: "power2.out", overwrite: true, onUpdate: render });
    },
    onRefresh: (self) => {
      measure();
      state.p = self.progress * (n - 1);
      render();
    },
  });
  measure();
  render();

  thumbs.forEach((t) => t.addEventListener("click", onThumb));
};

/* ───────────────────────── CATÁLOGO: cada categoría (/productos) ───────────────────────── */
const catgrid: Builder = (el) => {
  const opener = $(".cat__opener", el);
  const label = $(".cat__label", el);
  const pattern = $(".cat__pattern", el);
  if (opener && label) {
    gsap.fromTo(label, { scale: 1.25, rotation: -12 }, {
      scale: 1, rotation: -5, ease: "none",
      scrollTrigger: { trigger: opener, start: "top bottom", end: "center 60%", scrub: 0.5 },
    });
  }
  if (opener && pattern) {
    gsap.fromTo(pattern, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: opener, start: "top bottom", end: "bottom top", scrub: true },
    });
  }
  // Todas las fichas entran igual: suben, se enderezan y la foto gira hasta quedar derecha.
  $$(".ficha", el).forEach((card, i) => {
    const st = { trigger: card, start: "top bottom", end: "top 78%", scrub: 0.4 };
    gsap.fromTo(card, { y: 70, rotation: i % 2 ? 3 : -3, autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, ease: "power2.out", scrollTrigger: st });
    const spin = $(".ficha__spin", card);
    if (spin) gsap.fromTo(spin, { rotation: -40, scale: 0.8 }, { rotation: 0, scale: 1, ease: "power2.out", scrollTrigger: { ...st } });
  });
};

/* ───────────────────────── PARTNERS ───────────────────────── */
const partners: Builder = (el) => {
  const title = $(".partners__title", el);
  const list = need($(".sheet__list", el), "sheet__list");
  const items = $$("li", list);
  const rules = $$(".sheet__row", el);
  if (title) {
    gsap.fromTo(title, { yPercent: 30, autoAlpha: 0 }, {
      yPercent: 0, autoAlpha: 1, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", end: "top 40%", scrub: 0.5 },
    });
  }
  gsap.fromTo(rules, { autoAlpha: 0 }, {
    autoAlpha: 1, stagger: 0.2,
    scrollTrigger: { trigger: list, start: "top 92%", end: "bottom 80%", scrub: 0.5 },
  });
  gsap.fromTo(items, { autoAlpha: 0, y: 16 }, {
    autoAlpha: 1, y: 0, stagger: 0.03, ease: "power2.out",
    scrollTrigger: { trigger: list, start: "top 90%", end: "bottom 75%", scrub: 0.5 },
  });
};

/* ───────────────────────── CIERRE ───────────────────────── */
const closing: Builder = (el) => {
  const card = need($(".closing__card", el), "closing__card");
  const copyItems = $$(".closing__copy > *", el);
  gsap.fromTo(card, { y: () => vh() * 0.3, rotation: -24, scale: 0.7 }, {
    y: 0, rotation: -4, scale: 1, ease: "none",
    scrollTrigger: { trigger: el, start: "top 95%", end: "top 20%", scrub: 0.6, invalidateOnRefresh: true },
  });
  // El texto y el botón se revelan una sola vez por tiempo (no scrub), así el CTA nunca queda a medias.
  gsap.from(copyItems, {
    autoAlpha: 0, y: 40, stagger: 0.09, duration: 0.7, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 65%", once: true },
  });
};

/* ───────────────────────── Montaje ───────────────────────── */
const BUILDERS: Record<string, Builder> = { hero, about, what, intro, cat: category, catgrid, partners, closing };

function mountAll(desktop: boolean): Cleanup {
  const mounted: { el: HTMLElement; ctx: gsap.Context; cleanups: Cleanup[] }[] = [];
  const runAll = (cleanups: Cleanup[]) => {
    for (const fn of cleanups.reverse()) {
      try { fn(); } catch { /* noop */ }
    }
  };
  for (const el of $$("[data-section]", document)) {
    const build = BUILDERS[el.dataset.section || ""];
    if (!build) continue;
    el.dataset.motion = "on";
    const cleanups: Cleanup[] = [];
    const ctx = gsap.context(() => {});
    let failure: unknown = null;
    // El error se atrapa DENTRO de ctx.add: si se escapa, GSAP no restaura su contexto global
    // y las secciones siguientes quedarían colgadas del contexto fallado.
    ctx.add(() => {
      try {
        const ret = build(el, { desktop, onCleanup: (fn) => cleanups.push(fn) });
        if (ret) cleanups.push(ret);
      } catch (err) {
        failure = err;
      }
    });
    if (failure) {
      ctx.revert();
      runAll(cleanups);
      delete el.dataset.motion;
      console.error("[motion] sección en modo estático:", el.id || el.className, failure);
    } else {
      mounted.push({ el, ctx, cleanups });
    }
  }
  return () => {
    for (const m of mounted.reverse()) {
      m.ctx.revert();
      runAll(m.cleanups);
      delete m.el.dataset.motion;
    }
  };
}

/* ───────────────────── Conservar el lugar del usuario ─────────────────────
   Cuando cambia el layout (rotar, cruzar 900 px, llegada tardía del JS, refresh con otros
   largos), se guarda en qué bloque estaba el usuario y en qué proporción, y se vuelve ahí. */
type Anchor = { i: number; frac: number } | null;
const blocks = () => $$("main > *, .site-footer", document);
const saveAnchor = (): Anchor => {
  const y = window.scrollY;
  if (y < 2) return null;
  const list = blocks();
  for (let i = 0; i < list.length; i++) {
    const r = list[i].getBoundingClientRect();
    const top = r.top + y;
    if (y >= top && y < top + r.height) return { i, frac: (y - top) / Math.max(1, r.height) };
  }
  return null;
};
const restoreAnchor = (a: Anchor) => {
  if (!a) return;
  const el = blocks()[a.i];
  if (!el) return;
  const r = el.getBoundingClientRect();
  const target = Math.round(r.top + window.scrollY + a.frac * r.height);
  if (Math.abs(target - window.scrollY) > 2) window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior });
};
// El anchor se toma de la última posición estable: al cambiar el tamaño, el CSS ya reacomodó
// todo antes de que corran matchMedia y el refresh, así que medir en ese momento daría mal.
let lastAnchor: Anchor = null;
let resizedAt = -1e9;
const settling = () => performance.now() - resizedAt < 700;
addEventListener("resize", () => { resizedAt = performance.now(); });
let anchorQueued = false;
addEventListener("scroll", () => {
  if (anchorQueued) return;
  anchorQueued = true;
  requestAnimationFrame(() => {
    anchorQueued = false;
    if (!settling()) lastAnchor = saveAnchor();
  });
}, { passive: true });
const currentAnchor = () => (settling() ? lastAnchor : saveAnchor());

let forcedAnchor: Anchor | undefined;
let refreshAnchor: Anchor = null;
ScrollTrigger.addEventListener("refreshInit", () => {
  refreshAnchor = forcedAnchor !== undefined ? forcedAnchor : currentAnchor();
});
ScrollTrigger.addEventListener("refresh", () => {
  restoreAnchor(refreshAnchor);
  forcedAnchor = undefined;
  refreshAnchor = null;
  lastAnchor = saveAnchor();
});

const root = document.documentElement;
const mm = gsap.matchMedia();
// Las animaciones necesitan un viewport con algo de alto: en un celular acostado (≈390 px)
// las secciones fijas no entran, así que ahí se usa el layout estático.
mm.add(
  {
    motion: "(prefers-reduced-motion: no-preference) and (min-height: 520px)",
    desktop: "(min-width: 900px)",
  },
  (context) => {
    const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
    const anchor = currentAnchor();
    if (!motion) {
      root.removeAttribute("data-motion-boot");
      requestAnimationFrame(() => { restoreAnchor(anchor); lastAnchor = saveAnchor(); });
      return;
    }
    let unmount: Cleanup = () => {};
    try {
      unmount = mountAll(!!desktop);
      window.__chMotion = true;
    } catch (err) {
      console.error("[motion] desactivado:", err);
    }
    root.removeAttribute("data-motion-boot");
    forcedAnchor = anchor;
    ScrollTrigger.refresh();
    return () => unmount();
  },
);

// Recalibrar cuando cambian las métricas del texto. Las imágenes no hace falta: todas tienen
// su caja reservada (width/height o tamaño fijo), así que al cargar no mueven nada.
document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
