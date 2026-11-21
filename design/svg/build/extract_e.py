"""Extract the engraved E as clean polygons from the 1024 master.

Lime coverage per pixel comes from the anti-aliased red channel (lime R=146 over white R=255), so
iso-contours at 0.5 land with subpixel accuracy. Contours are then reduced with Douglas-Peucker to
straight segments; the artwork is all straight edges, so this yields a handful of vertices per shape.
Writes e_paths.json: a list of closed polygons in 1024-canvas coordinates.
"""
import json
import sys

import numpy as np
from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]
TOL = float(sys.argv[3]) if len(sys.argv) > 3 else 0.45

im = Image.open(SRC).convert("RGBA")
bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
bg.alpha_composite(im)
rgb = np.asarray(bg).astype(float)
cov = np.clip((255 - rgb[..., 0]) / (255 - 146), 0, 1)

# Only the E's region (excludes the ring and the spark).
x0, y0, x1, y1 = 262, 178, 766, 846
field = np.zeros((y1 - y0 + 2, x1 - x0 + 2))
field[1:-1, 1:-1] = cov[y0:y1, x0:x1]
H, W = field.shape
T = 0.5


def interp(p1, v1, p2, v2):
    t = (T - v1) / (v2 - v1)
    return (p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1]))


# Marching squares: segments oriented so the filled side is on the left (consistent winding).
segs = []
for y in range(H - 1):
    for x in range(W - 1):
        tl, tr, br, bl = field[y, x], field[y, x + 1], field[y + 1, x + 1], field[y + 1, x]
        idx = (tl > T) * 8 + (tr > T) * 4 + (br > T) * 2 + (bl > T)
        if idx in (0, 15):
            continue
        P = {"tl": (x, y), "tr": (x + 1, y), "br": (x + 1, y + 1), "bl": (x, y + 1)}
        e = {
            "t": interp(P["tl"], tl, P["tr"], tr),
            "r": interp(P["tr"], tr, P["br"], br),
            "b": interp(P["bl"], bl, P["br"], br),
            "l": interp(P["tl"], tl, P["bl"], bl),
        }
        table = {
            1: [("l", "b")], 2: [("b", "r")], 3: [("l", "r")], 4: [("r", "t")],
            6: [("b", "t")], 7: [("l", "t")], 8: [("t", "l")], 9: [("t", "b")],
            11: [("t", "r")], 12: [("r", "l")], 13: [("r", "b")], 14: [("b", "l")],
        }
        if idx in (5, 10):
            centre = (tl + tr + br + bl) / 4 > T
            if idx == 5:
                table[5] = [("l", "t"), ("r", "b")] if centre else [("r", "t"), ("l", "b")]
            else:
                table[10] = [("t", "r"), ("b", "l")] if centre else [("t", "l"), ("b", "r")]
        for a, b in table[idx]:
            segs.append((e[a], e[b]))


def key(p):
    return (round(p[0], 4), round(p[1], 4))


nxt = {}
for a, b in segs:
    nxt.setdefault(key(a), []).append(b)
loops = []
used = set()
for start in list(nxt):
    if start in used:
        continue
    loop = [start]
    used.add(start)
    cur = start
    while True:
        cands = [c for c in nxt.get(cur, []) if key(c) not in used or key(c) == start]
        if not cands:
            break
        c = key(cands[0])
        if c == start:
            break
        loop.append(c)
        used.add(c)
        cur = c
    if len(loop) > 8:
        loops.append(loop)


def dp(pts, tol):
    if len(pts) < 3:
        return pts
    a, b = np.array(pts[0]), np.array(pts[-1])
    ab = b - a
    n = np.hypot(*ab)
    best, bi = -1, 0
    for i in range(1, len(pts) - 1):
        p = np.array(pts[i])
        d = abs(ab[0] * (a[1] - p[1]) - ab[1] * (a[0] - p[0])) / n if n else np.hypot(*(p - a))
        if d > best:
            best, bi = d, i
    if best > tol:
        return dp(pts[: bi + 1], tol)[:-1] + dp(pts[bi:], tol)
    return [pts[0], pts[-1]]


def simplify_closed(loop, tol):
    arr = np.array(loop)
    # split at the two mutually farthest-ish points
    i0 = 0
    d = np.hypot(*(arr - arr[i0]).T)
    i1 = int(d.argmax())
    a = dp(loop[: i1 + 1], tol)
    b = dp(loop[i1:] + [loop[0]], tol)
    return a[:-1] + b[:-1]


polys = []
for loop in loops:
    s = simplify_closed(loop, TOL)
    # back to canvas coordinates (field had a 1px pad)
    polys.append([[round(px + x0 - 1 + 0.5, 2), round(py + y0 - 1 + 0.5, 2)] for px, py in s])

json.dump(polys, open(OUT, "w"))
print(f"{len(polys)} polygons, {sum(len(p) for p in polys)} vertices; sizes: {sorted(len(p) for p in polys)}")
