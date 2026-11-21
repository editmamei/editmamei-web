"""Exploration (2026-11-21, not adopted): try the mark with Bricolage Grotesque's own capital E in place of the engraved E."""
import runpy
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

BUILD = Path(__file__).resolve().parent
SVG = BUILD.parent
OUT = SVG / "explorations"
OUT.mkdir(exist_ok=True)
sys.argv = ["build_mark.py", str(SVG.parent / "Editmamei-icon.png"), str(BUILD / "e_paths.json"), str(SVG)]
ns = runpy.run_path(str(BUILD / "build_mark.py"))
ring_svg, spark_path, doc, wd, ww, cap = ns["ring_svg"], ns["spark_path"], ns["doc"], ns["wd"], ns["ww"], ns["cap"]
LIME, EVERGREEN, LIME_CREAM, WHITE = "#92C33E", "#143731", "#CEFF8C", "#FFFFFF"

font = TTFont(str(BUILD.parents[2] / "static" / "fonts" / "bricolage-grotesque-latin.woff2"))
gs = font.getGlyphSet()
g = gs[font.getBestCmap()[ord("E")]]
bp = BoundsPen(gs)
g.draw(bp)
xmin, ymin, xmax, ymax = bp.bounds
CAP = 600.0                      # rendered height of the E, close to the engraved E's front face (590)
k = CAP / (ymax - ymin)
w = (xmax - xmin) * k
x0 = 511.5 - w / 2 - xmin * k    # centre in the ring
y0 = 511.5 + CAP / 2 + ymin * k  # baseline so the glyph is vertically centred


def e_path(dx=0.0, dy=0.0):
    pen = SVGPathPen(gs)
    g.draw(TransformPen(pen, (k, 0, 0, -k, x0 + dx, y0 + dy)))
    return pen.getCommands()


def mark(e_col, ring_col=None, star_col=LIME, shadow=None, disc=False):
    defs, ringg = ring_svg(ring_col)
    body = ""
    if disc:
        body += '<circle cx="511.5" cy="511.5" r="474.3" fill="#ffffff"/>'
    body += ringg + f'<path d="{spark_path()}" fill="{star_col}"/>'
    if shadow:
        body += f'<path d="{e_path(30, 30)}" fill="{shadow}"/>'
    body += f'<path d="{e_path()}" fill="{e_col}"/>'
    return defs, body


VB = (20, 20, 984, 984)
variants = {
    "A-lime": mark(LIME),
    "B-evergreen": mark(EVERGREEN),
    "C-lime-shadow": mark(LIME, shadow=EVERGREEN),
    "D-embroidery-dark": mark(LIME, ring_col=LIME_CREAM, shadow=LIME_CREAM),
}
for name, (defs, body) in variants.items():
    (OUT / f"bric-{name}.svg").write_text(doc(defs, body, VB), newline="\n")


def lockup(defs, mg, text_col):
    msize = 984
    tc = 0.40 * msize
    s = tc / cap
    gap = 0.13 * msize
    tx, ty = msize + gap, msize / 2 + tc / 2
    body = (f'<g transform="translate(-20,-20)">{mg}</g>'
            f'<path transform="translate({tx:.1f},{ty:.1f}) scale({s:.4f})" d="{wd}" fill="{text_col}"/>')
    return doc(defs, body, (0, 0, tx + ww * s + 10, msize))


(OUT / "bric-lockup-A-on-light.svg").write_text(lockup(*mark(LIME), EVERGREEN), newline="\n")
(OUT / "bric-lockup-C-on-light.svg").write_text(lockup(*mark(LIME, shadow=EVERGREEN), EVERGREEN), newline="\n")
(OUT / "bric-lockup-D-on-dark.svg").write_text(
    lockup(*mark(LIME, ring_col=LIME_CREAM, shadow=LIME_CREAM), WHITE), newline="\n")
print("written", sorted(p.name for p in OUT.iterdir()))
