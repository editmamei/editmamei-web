# Editmamei logo SVGs

Vector versions of the live mark (the engraved E in the gradient ring with the spark, `../Editmamei-icon.png`) and the wordmark, for print, merch and anything that needs to scale. Built 2026-11-21. Never deployed: `design/` is not served.

## Files

| File                                                             | Use                                                                                                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `editmamei-mark.svg`                                             | Full-color mark, transparent. Light backgrounds.                                                                     |
| `editmamei-mark-disc.svg`                                        | Full-color mark on a white disc. Dark backgrounds and dark fabric (the ring's dark end vanishes on black otherwise). |
| `editmamei-mark-1c-{evergreen,white,black}.svg`                  | One color, full engraved detail. Screen print, single-ink print, laser.                                              |
| `editmamei-mark-embroidery-light-fabric.svg`                     | Embroidery on light fabric: solid E face (lime) over an evergreen extrusion, evergreen ring, no stripes.             |
| `editmamei-mark-embroidery-dark-fabric.svg`                      | Embroidery on dark fabric: lime face, lime-cream extrusion and ring.                                                 |
| `editmamei-wordmark-{evergreen,white,black}.svg`                 | "Editmamei" as outlines.                                                                                             |
| `editmamei-lockup-{horizontal,stacked}-on-light.svg`             | Full-color mark + evergreen wordmark.                                                                                |
| `editmamei-lockup-{horizontal,stacked}-on-dark.svg`              | Full-color mark + white wordmark.                                                                                    |
| `editmamei-lockup-{horizontal,stacked}-1c-{white,evergreen}.svg` | One-color lockups.                                                                                                   |

**Embroidery:** the engraved stripes are about 0.5 mm wide at hat size, below the ~1 mm embroidery minimum, so stitched items use the `embroidery` versions. Printed items (DTF, sublimation, mugs) can use the full mark.

Colors: lime `#92C33E` (sampled from the master), evergreen `#143731`, lime cream `#CEFF8C` (both from `../palette.md`). The ring gradient runs from `#092c21` to `#bce498`, sampled every 3° around the master.

## How they were made

Measured from the 1024 px master, not auto-traced:

- **E**: `build/extract_e.py` takes iso-contours of the anti-aliased lime coverage at 0.5 and reduces them to straight segments (28 polygons, 306 vertices; the art is all straight edges). Stored in `build/e_paths.json`.
- **Ring**: a 27.7 px stroke at radius 474.3 about the canvas center, round ends at 31.73° and 57.87°. SVG has no conic gradient, so it is drawn as 120 short arcs, each with its own linear gradient.
- **Spark**: the master's outline measured along rays from its center (dense near the tips), then a closed smooth spline.
- **Wordmark**: Bricolage Grotesque ExtraBold at opsz 96 (the default instance of `static/fonts/bricolage-grotesque-latin.woff2`, OFL), converted to outlines with the font's pair kerning.

The full-color mark renders within about 1 px of the master everywhere (anti-aliasing at edges only).

## Rebuild

Needs Python with numpy, Pillow, scipy and fontTools (with brotli for the woff2).

```sh
python design/svg/build/extract_e.py design/Editmamei-icon.png design/svg/build/e_paths.json
python design/svg/build/build_mark.py design/Editmamei-icon.png design/svg/build/e_paths.json design/svg
```

If the master PNG changes, run both steps. The build is deterministic: re-running it reproduces the files byte for byte.

## Open: wordmark optical size

The wordmark, the lockups and `explorations/` use the font file's default instance, **opsz 96, weight 800** (display cut: narrower, tighter, sharper). The site never shows that cut: it sets everything in **weight 700**, and `font-optical-sizing: auto` picks the opsz from the rendered size, so the header's 18 px "Editmamei" is **opsz 18, weight 700** (wider, softer). The owner noticed the difference (2026-11-21). Pending the owner's pick, rebuild with opsz 18 / wght 700 (matches the header) or opsz 48 / wght 700 (matches the large headings): instance the font with `fontTools.varLib.instancer.instantiateVariableFont(font, {"opsz": 18, "wght": 700})` in `build/wordmark.py` and `build/explore_bricolage_e.py`, then rebuild.

## Explorations (not the logo)

`explorations/` holds a 2026-11-21 test of the mark with Bricolage Grotesque's own capital E in place of the engraved E: lime (A), evergreen (B), lime with an evergreen 3D shadow (C), C for dark fabric (D), and lockups. None is adopted; the engraved E is the mark. Regenerate with `python design/svg/build/explore_bricolage_e.py`.
