"""'Editmamei' as SVG outlines in Bricolage Grotesque ExtraBold (opsz 96), with GPOS pair kerning.

Returns (path_d, width, cap_height, ascent_top) in font units scaled to `size` px per em, baseline y=0.
"""
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

from pathlib import Path

FONT = str(Path(__file__).resolve().parents[3] / "static" / "fonts" / "bricolage-grotesque-latin.woff2")


def _kern_value(font, left, right):
    gpos = font["GPOS"].table
    total = 0
    kern_lookups = set()
    for fr in gpos.FeatureList.FeatureRecord:
        if fr.FeatureTag == "kern":
            kern_lookups.update(fr.Feature.LookupListIndex)
    for li in sorted(kern_lookups):
        lookup = gpos.LookupList.Lookup[li]
        subs = lookup.SubTable
        if lookup.LookupType == 9:
            subs = [s.ExtSubTable for s in subs]
        for st in subs:
            if getattr(st, "LookupType", 2) != 2 or left not in st.Coverage.glyphs:
                continue
            if st.Format == 1:
                ps = st.PairSet[st.Coverage.glyphs.index(left)]
                for pvr in ps.PairValueRecord:
                    if pvr.SecondGlyph == right and pvr.Value1 is not None:
                        total += getattr(pvr.Value1, "XAdvance", 0) or 0
                        break
                else:
                    continue
                break
            if st.Format == 2:
                c1 = st.ClassDef1.classDefs.get(left, 0)
                c2 = st.ClassDef2.classDefs.get(right, 0)
                rec = st.Class1Record[c1].Class2Record[c2]
                v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 is not None else 0
                if v:
                    total += v
                    break
    return total


def wordmark(text="Editmamei", size=100.0):
    font = TTFont(FONT)
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upem = font["head"].unitsPerEm
    s = size / upem
    names = [cmap[ord(c)] for c in text]
    pen = SVGPathPen(gs)
    x = 0
    for i, g in enumerate(names):
        tp = TransformPen(pen, (s, 0, 0, -s, x * s, 0))
        gs[g].draw(tp)
        x += gs[g].width
        if i + 1 < len(names):
            x += _kern_value(font, g, names[i + 1])
    cap = font["OS/2"].sCapHeight * s
    return pen.getCommands(), x * s, cap
