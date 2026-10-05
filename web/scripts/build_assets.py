"""
Convierte el material de ../resouces (solo lectura) a activos web en public/assets.
Requisitos (fuera del proyecto web): Python 3 con pymupdf, pillow, numpy, scipy; ImageMagick y cwebp.
Los recortes de producto se generan antes con la herramienta de Vision de macOS (ver README).
Uso: python scripts/build_assets.py <carpeta_recortes> [pasos...]
"""
import os, re, subprocess, sys
import pymupdf
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(os.path.dirname(ROOT), "resouces", "Cruda Haus")
OUT = os.path.join(ROOT, "public", "assets")
CUTS = sys.argv[1] if len(sys.argv) > 1 else None

def ensure(p):
    os.makedirs(p, exist_ok=True)
    return p

def webp(src, dst, width=None, q=80, alpha_q=90):
    args = ["cwebp", "-quiet", "-q", str(q), "-alpha_q", str(alpha_q), "-m", "6"]
    if width:
        args += ["-resize", str(width), "0"]
    subprocess.run(args + [src, "-o", dst], check=True)

# ---------- Logos vectoriales (CH-Logos.ai ya viene con el texto en curvas) ----------
LOGO_PAGES = {
    "institucional-azul": 2, "institucional-offwhite": 4,
    "gotico-proveeduria-azul": 6, "gotico-proveeduria-rojo": 7, "gotico-proveeduria-offwhite": 8,
    "sello-deli-azul": 14, "sello-deli-offwhite": 22,
    "galgo-azul": 20, "galgo-offwhite": 24,
}

def logos():
    out = ensure(os.path.join(OUT, "logos"))
    doc = pymupdf.open(os.path.join(RES, "Logos Vector", "Editable", "CH-Logos.ai"))
    for name, pno in LOGO_PAGES.items():
        page = doc[pno - 1]
        bbox = None
        for d in page.get_drawings():
            bbox = d["rect"] if bbox is None else bbox | d["rect"]
        page.set_cropbox(page.mediabox)
        svg = page.get_svg_image(text_as_path=True)
        x, y, w, h = bbox.x0 - 2, bbox.y0 - 2, bbox.width + 4, bbox.height + 4
        svg = re.sub(r'width="[^"]+" height="[^"]+" viewBox="[^"]+"',
                     f'viewBox="{x:.2f} {y:.2f} {w:.2f} {h:.2f}"', svg, count=1)
        # el clip original es el artboard y recorta al galgo; el viewBox ya encuadra el dibujo
        svg = re.sub(r'<clipPath id="clip_\d+">.*?</clipPath>', '', svg, flags=re.S)
        svg = re.sub(r' clip-path="url\(#clip_\d+\)"', '', svg)
        if name == "galgo-offwhite":  # el original está en #ffffff; el Toolkit pide Off-Blanwhite
            svg = svg.replace("#ffffff", "#f9f7f4")
        with open(os.path.join(out, f"{name}.svg"), "w") as f:
            f.write(svg)
        print("logo", name, round(w), round(h))

# ---------- Logos con efecto (PNG) ----------
EFECTO = {
    "gotico-proveeduria-rojo-fx": "Gotico + Proveeduria/Rojo.png",
    "gotico-proveeduria-offwhite-fx": "Gotico + Proveeduria/OffWhite.png",
    "galgo-offwhite-fx": "Galgo/OffWhite.png",
    "galgo-azul-fx": "Galgo/Azul.png",
    "institucional-offwhite-fx": "Institucional/OffWhite.png",
}

def efecto():
    out = ensure(os.path.join(OUT, "logos"))
    for name, rel in EFECTO.items():
        src = os.path.join(RES, "Logos + Efecto", rel)
        tmp = os.path.join(out, name + ".tmp.png")
        subprocess.run(["magick", src, "-trim", "+repage", tmp], check=True)
        webp(tmp, os.path.join(out, f"{name}.webp"), width=1600, q=82)
        im = Image.open(tmp); print("fx", name, im.size); os.remove(tmp)

# ---------- Pattern Papel Manteca ----------
def pattern():
    out = ensure(os.path.join(OUT, "pattern"))
    doc = pymupdf.open(os.path.join(RES, "Patterns", "CH- Pattern Papel Manteca.pdf"))
    pix = doc[0].get_pixmap(matrix=pymupdf.Matrix(1, 1), alpha=False)
    tmp = os.path.join(out, "tmp.png"); pix.save(tmp)
    # fondo blanco -> transparente, para apoyarlo sobre Off-Blanwhite
    subprocess.run(["magick", tmp, "-alpha", "set", "-channel", "RGBA", "-fuzz", "3%",
                    "-fill", "none", "-opaque", "white", tmp], check=True)
    webp(tmp, os.path.join(out, "papel-manteca.webp"), q=72)
    webp(tmp, os.path.join(out, "papel-manteca-sm.webp"), width=1200, q=72)
    os.remove(tmp)

# ---------- Fotos y mockups ----------
FOTOS = {
    "manos-crudas": "manos crudas.jpg",
    "pibe-batch-bagels": "pibe batch baggels.jpg",
    "envoltorios": "Envoltorios.jpg",
    "envoltorios-2": "EnvoltoriosII.jpg",
    "manteca": "Manteca 2.jpg",
    "pack-de-pan": "Pack de pan.jpg",
    "magazine": "Magazine.jpg",
    "tarjeta-tnt": "Tarjeta TNT.jpg",
}

def fotos():
    out = ensure(os.path.join(OUT, "fotos"))
    for name, rel in FOTOS.items():
        src = os.path.join(RES, "Fotos Refe + Mock Ups", rel)
        w = Image.open(src).size[0]
        webp(src, os.path.join(out, f"{name}.webp"), width=min(w, 1600), q=78)
        webp(src, os.path.join(out, f"{name}-sm.webp"), width=min(w, 800), q=74)
        print("foto", name, Image.open(src).size)

def rrss():
    out = ensure(os.path.join(OUT, "rrss"))
    src = os.path.join(RES, "Perfil RRSS", "Inst-Azul.jpg")
    subprocess.run(["magick", src, "-resize", "180x180", os.path.join(ROOT, "public", "apple-touch-icon.png")], check=True)
    subprocess.run(["magick", src, "-resize", "64x64", os.path.join(ROOT, "public", "favicon.png")], check=True)
    for n in ["Inst-Azul", "Galgo-Blanco"]:
        webp(os.path.join(RES, "Perfil RRSS", f"{n}.jpg"), os.path.join(out, f"{n.lower()}.webp"), width=320, q=80)

# ---------- Productos (recortes de las fichas de cruda-haus.pdf) ----------
def productos():
    if not CUTS:
        print("sin carpeta de recortes; salteo productos"); return
    out = ensure(os.path.join(OUT, "productos"))
    for f in sorted(os.listdir(CUTS)):
        if not f.endswith(".png"): continue
        im = Image.open(os.path.join(CUTS, f)).convert("RGBA")
        im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
        side = 1000; fit = 860
        s = fit / max(im.size)
        im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2), im)
        tmp = os.path.join(out, "tmp.png"); canvas.save(tmp)
        page = f[:-4]
        webp(tmp, os.path.join(out, f"p{page}.webp"), width=900, q=80)
        webp(tmp, os.path.join(out, f"p{page}-sm.webp"), width=520, q=78)
        os.remove(tmp)
        print("producto", page)

if __name__ == "__main__":
    steps = sys.argv[2:] or ["logos", "efecto", "pattern", "fotos", "rrss", "productos"]
    for step in steps:
        globals()[step]()
