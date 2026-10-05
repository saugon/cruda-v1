// ─────────────────────────────────────────────────────────────
//  CONTACTO — único lugar para editar WhatsApp e Instagram.
//  Todos los valores de abajo son PLACEHOLDERS: reemplazalos.
// ─────────────────────────────────────────────────────────────
export const CONTACT = {
  /** Número de WhatsApp en formato internacional, solo dígitos (ej.: 5491122223333). */
  whatsappNumber: "5491100000000",
  /** Mensaje que aparece ya escrito al abrir el chat. */
  whatsappMessage:
    "¡Hola, Cruda Haus! Tengo un local (café, restó, almacén o deli) y quiero sumarme como cliente mayorista. ¿Me pasan el catálogo y las condiciones?",
  /** Usuario de Instagram, sin @. */
  instagramUser: "crudahaus_placeholder",
};

export const whatsappUrl = () =>
  `https://wa.me/${CONTACT.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;

export const instagramUrl = () => `https://www.instagram.com/${CONTACT.instagramUser}/`;
