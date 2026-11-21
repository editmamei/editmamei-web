"""Build the Editmamei engraved-E mark as SVG from measured geometry.

Ring: stroke 27.7 at r=474.3 about (511.5, 511.5) (canvas 1024), round ends at 31.73 and 57.87 deg,
colour sampled from the master every 2 deg (a conic gradient, drawn as short gradient segments).
Spark: 4-point star at (856, 167), tips 105 out, concave sides fitted as cubics to the measured outline.
E: polygons from extract_e.py, fill #92C33E, even-odd.
"""
import json
import math
import sys

import numpy as np
from PIL import Image
from scipy.optimize import minimize

SRC, EPATHS, OUTDIR = sys.argv[1], sys.argv[2], sys.argv[3]
CX = CY = 511.5
R, SW = 474.3, 27.7
A_LIGHT, A_DARK = 31.73, 57.87          # ring end-cap centres (deg, CCW from +x, y up)
LIME = "#92C33E"

im = Image.open(SRC).convert("RGBA")
arr = np.asarray(im).astype(int)


def pt(deg, r=R):
    t = math.radians(deg)
    return CX + r * math.cos(t), CY - r * math.sin(t)


def sample(deg):
    x, y = pt(deg)
    px = arr[int(round(y)), int(round(x))]
    return "#%02x%02x%02x" % tuple(px[:3])


# Ring runs CCW from the dark end (57.87) all the way round to the light end (31.73 + 360).
start, end = A_DARK, A_LIGHT + 360
N = 120
angles = [start + (end - start) * i / N for i in range(N + 1)]
cols = [sample(a) for a in angles]


def ring_svg(mono=None):
    out = []
    defs = []
    for i in range(N):
        a0, a1 = angles[i], angles[i + 1]
        x0, y0 = pt(a0)
        x1, y1 = pt(a1 + 0.15)            # tiny overlap hides seams
        if mono:
            stroke = mono
        else:
            gid = f"rg{i}"
            defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{x0:.2f}" y1="{y0:.2f}" '
                        f'x2="{x1:.2f}" y2="{y1:.2f}"><stop offset="0" stop-color="{cols[i]}"/>'
                        f'<stop offset="1" stop-color="{cols[i+1]}"/></linearGradient>')
            stroke = f"url(#{gid})"
        out.append(f'<path d="M{x0:.2f} {y0:.2f}A{R} {R} 0 0 0 {x1:.2f} {y1:.2f}" stroke="{stroke}"/>')
    # round end caps
    for a, c in ((A_DARK, cols[0]), (A_LIGHT, cols[-1])):
        x, y = pt(a)
        out.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{SW/2:.2f}" fill="{mono or c}"/>')
    g = f'<g fill="none" stroke-width="{SW}" stroke-linecap="butt">' + "".join(out) + "</g>"
    return ("".join(defs), g)


# --- spark: measure its outline from the master, fit a symmetric cubic per side ---
lime = (abs(arr[..., 0] - 0x92) < 25) & (abs(arr[..., 1] - 0xC3) < 25) & (abs(arr[..., 2] - 0x3E) < 35) & (arr[..., 3] > 128)
SX, SY = 856.0, 167.0
meas = []
for d in np.arange(28, 104, 2.0):
    x = int(round(SX + d))
    col = np.nonzero(lime[int(SY) - 60:int(SY), x])[0]
    if len(col):
        h = 60 - col.min()
        meas.append((d, float(h)))
meas = np.array(meas)
TIP = 105.0


def cubic(p0, p1, p2, p3, t):
    t = t[:, None]
    return (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3


def err(v):
    a, b = v
    p0, p1, p2, p3 = np.array([TIP, 0]), np.array([a, b]), np.array([b, a]), np.array([0, TIP])
    c = cubic(p0, p1, p2, p3, np.linspace(0, 1, 400))
    e = 0
    for d, h in meas:
        e += np.min(np.hypot(c[:, 0] - d, c[:, 1] - h)) ** 2
    return e


fit = minimize(err, [40, 10], method="Nelder-Mead")
a, b = fit.x
print(f"spark fit a={a:.2f} b={b:.2f} rms={math.sqrt(fit.fun/len(meas)):.2f}px")


bgc = Image.new("RGBA", im.size, (255, 255, 255, 255))
bgc.alpha_composite(im)
cov = np.clip((255 - np.asarray(bgc).astype(float)[..., 0]) / (255 - 0x92), 0, 1)


def rho(phi_deg):
    """Distance from the spark centre to its edge (coverage 0.5) along a ray, y up."""
    t = math.radians(phi_deg)
    prev = 1.0
    for r10 in range(0, 1200):
        r = r10 / 10
        x, y = SX + r * math.cos(t), SY - r * math.sin(t)
        xi, yi = int(x), int(y)
        fx, fy = x - xi, y - yi
        c = (cov[yi, xi] * (1 - fx) * (1 - fy) + cov[yi, xi + 1] * fx * (1 - fy)
             + cov[yi + 1, xi] * (1 - fx) * fy + cov[yi + 1, xi + 1] * fx * fy)
        if c < 0.5 <= prev:
            return r - 0.1 * (0.5 - c) / max(prev - c, 1e-6)
        prev = c
    return None


# Offsets from each tip's axis; dense near the tip so the rounding is captured.
OFFS = [0, 1, 2.5, 4.5, 7, 10, 14, 19, 25, 32, 39]
prof = {}
for o in OFFS + [45]:
    vals = []
    for k in range(4):
        for s in (1, -1):
            r = rho(90 * k + s * o)
            if r:
                vals.append(r)
    prof[o] = float(np.median(vals))
print("spark polar profile:", {k: round(v, 1) for k, v in prof.items()})


def spark_path():
    # Knot angles round the whole star, symmetric profile, then a closed Catmull-Rom spline as cubics.
    angs = []
    for k in range(4):
        base = 90 * k
        for o in [-39, -32, -25, -19, -14, -10, -7, -4.5, -2.5, -1, 0, 1, 2.5, 4.5, 7, 10, 14, 19, 25, 32, 39]:
            angs.append(base + o)
        angs.append(base + 45)
    angs = sorted(set(round(a % 360, 3) for a in angs))
    P = []
    for ang in angs:
        o = abs(((ang + 45) % 90) - 45)
        r = prof[min(prof, key=lambda q: abs(q - o))] if o not in prof else prof[o]
        t = math.radians(ang)
        P.append((SX + r * math.cos(t), SY - r * math.sin(t)))
    n = len(P)
    d = f"M{P[0][0]:.2f} {P[0][1]:.2f}"
    for i in range(n):
        p0, p1, p2, p3 = P[i - 1], P[i], P[(i + 1) % n], P[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {p2[0]:.2f} {p2[1]:.2f}"
    return d + "Z"


polys = json.load(open(EPATHS))
e_d = "".join("M" + "L".join(f"{x:g} {y:g}" for x, y in p) + "Z" for p in polys)


def svg(ring=True, disc=False, ring_mono=None, mark_fill=LIME, star_fill=LIME, size=1024):
    defs, ringg = ring_svg(ring_mono) if ring else ("", "")
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="{size}" height="{size}">']
    if defs:
        parts.append(f"<defs>{defs}</defs>")
    if disc:
        parts.append(f'<circle cx="{CX}" cy="{CY}" r="{R:.1f}" fill="#ffffff"/>')
    parts.append(ringg)
    parts.append(f'<path d="{spark_path()}" fill="{star_fill}"/>')
    parts.append(f'<path d="{e_d}" fill="{mark_fill}" fill-rule="evenodd"/>')
    parts.append("</svg>")
    return "\n".join(parts)


print("ring colours: dark end", cols[0], "light end", cols[-1])


# ---------------------------------------------------------------- variants
sys.path.insert(0, str(__import__('pathlib').Path(__file__).resolve().parent))
from wordmark import wordmark  # noqa: E402

EVERGREEN, LIME_CREAM, WHITE = "#143731", "#CEFF8C", "#FFFFFF"


def area(p):
    return 0.5 * sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p)))


def d_of(ps):
    return "".join("M" + "L".join(f"{x:g} {y:g}" for x, y in p) + "Z" for p in ps)


face = max(polys, key=area)
extrusion = [p for p in polys if p is not face and area(p) > 10000]
assert len(extrusion) == 3, len(extrusion)


def mark_group(kind="full", ring_col=None, face_col=LIME, extr_col=None, star_col=LIME, disc=False):
    """Inner SVG for the mark in the 1024 canvas. kind: full | one-colour | embroidery."""
    g = []
    defs = ""
    if disc:
        g.append(f'<circle cx="{CX}" cy="{CY}" r="{R:.1f}" fill="#ffffff"/>')
    if kind == "full":
        defs, ringg = ring_svg(None)
    else:
        defs, ringg = ring_svg(ring_col)
    g.append(ringg)
    g.append(f'<path d="{spark_path()}" fill="{star_col}"/>')
    if kind == "embroidery":
        # Solid front face over a slightly dilated extrusion: no hairline gaps to stitch.
        g.append(f'<path d="{d_of(extrusion)}" fill="{extr_col}" stroke="{extr_col}" stroke-width="10" stroke-linejoin="round"/>')
        g.append(f'<path d="{d_of([face])}" fill="{face_col}"/>')
    else:
        g.append(f'<path d="{e_d}" fill="{face_col}" fill-rule="evenodd"/>')
    return defs, "".join(g)


def doc(defs, body, vb, w=None):
    vbx, vby, vbw, vbh = vb
    w = w or vbw
    h = w * vbh / vbw
    d = f"<defs>{defs}</defs>" if defs else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbx:g} {vby:g} {vbw:g} {vbh:g}" '
            f'width="{w:.0f}" height="{h:.0f}">{d}{body}</svg>\n')


MARK_VB = (20, 20, 984, 984)    # ring 24..1000 plus spark, with a hair of margin
out = {}
out["editmamei-mark.svg"] = doc(*mark_group("full"), MARK_VB)
out["editmamei-mark-disc.svg"] = doc(*mark_group("full", disc=True), MARK_VB)
for name, col in (("evergreen", EVERGREEN), ("white", WHITE), ("black", "#000000")):
    out[f"editmamei-mark-1c-{name}.svg"] = doc(*mark_group("one", ring_col=col, face_col=col, star_col=col), MARK_VB)
out["editmamei-mark-embroidery-light-fabric.svg"] = doc(
    *mark_group("embroidery", ring_col=EVERGREEN, face_col=LIME, extr_col=EVERGREEN, star_col=LIME), MARK_VB)
out["editmamei-mark-embroidery-dark-fabric.svg"] = doc(
    *mark_group("embroidery", ring_col=LIME_CREAM, face_col=LIME, extr_col=LIME_CREAM, star_col=LIME), MARK_VB)

# Wordmark: cap height set in font units of a 1000px em, then placed.
wd, ww, cap = wordmark("Editmamei", size=1000)
for name, col in (("evergreen", EVERGREEN), ("white", WHITE), ("black", "#000000")):
    out[f"editmamei-wordmark-{name}.svg"] = doc("", f'<path d="{wd}" fill="{col}"/>', (-10, -cap - 40, ww + 20, cap + 260))


def lockup(layout, text_col, mark_kind="full", **mk):
    defs, mg = mark_group(mark_kind, **mk)
    M0, M1 = 20, 1004                      # mark box in its own canvas
    msize = M1 - M0
    if layout == "horizontal":
        target_cap = 0.40 * msize
        k = target_cap / cap
        gap = 0.13 * msize
        tx = msize + gap
        ty = msize / 2 + target_cap / 2    # baseline so the caps centre on the ring
        body = (f'<g transform="translate({-M0},{-M0})">{mg}</g>'
                f'<path transform="translate({tx:.1f},{ty:.1f}) scale({k:.4f})" d="{wd}" fill="{text_col}"/>')
        return doc(defs, body, (0, 0, tx + ww * k + 10, msize))
    target_cap = 0.25 * msize
    k = target_cap / cap
    width = max(msize, ww * k)
    mx = (width - msize) / 2
    gap = 0.12 * msize
    by = msize + gap + target_cap
    body = (f'<g transform="translate({mx - M0:.1f},{-M0})">{mg}</g>'
            f'<path transform="translate({(width - ww * k) / 2:.1f},{by:.1f}) scale({k:.4f})" d="{wd}" fill="{text_col}"/>')
    return doc(defs, body, (0, 0, width, by + 0.07 * msize))


for layout in ("horizontal", "stacked"):
    out[f"editmamei-lockup-{layout}-on-light.svg"] = lockup(layout, EVERGREEN)
    out[f"editmamei-lockup-{layout}-on-dark.svg"] = lockup(layout, WHITE)
    out[f"editmamei-lockup-{layout}-1c-white.svg"] = lockup(
        layout, WHITE, "one", ring_col=WHITE, face_col=WHITE, star_col=WHITE)
    out[f"editmamei-lockup-{layout}-1c-evergreen.svg"] = lockup(
        layout, EVERGREEN, "one", ring_col=EVERGREEN, face_col=EVERGREEN, star_col=EVERGREEN)

for name, s in out.items():
    open(f"{OUTDIR}/{name}", "w", newline="\n").write(s)
print(f"wrote {len(out)} SVGs to {OUTDIR}")
