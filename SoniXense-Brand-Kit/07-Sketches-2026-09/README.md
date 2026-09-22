# SoniXense — X sketches, September 2026

Nine reconstructed X directions and the wordmark lockups that go with them.
Companion to the sketch sheet artifact.

## What's here

    svg/       9 directions × colour / ink / reverse
    lockup/    soniXense lockups — 8 shortlisted typefaces, plus
               3 on-dark and 3 alternative marks against Archivo
    src/       the geometry itself (see below)

## Two things that are fixed relative to brand-kit v1

**The type is outlined.** Every lockup here is pure vector paths — the open item
from the v1 build ("the wordmark in the lockup SVGs is live text") does not apply.
These go straight to a printer.

**The mark is constructed, not traced.** Five defining points per ribbon, four per
bar, on a 200-unit frame at true 45°. The second ribbon is the first rotated 180°,
so the symmetry is exact rather than approximate: measured back off the rendered
PNGs, every direction returns a self-rotation IoU of 1.0000. The one exception is
Beam, where the bar tapers on purpose — transmit and receive are meant to be
drawn differently.

## Geometry

Working coordinates are `(p, q)`: `p` along the bar, `q` perpendicular to it.
Because `q` *is* the distance from the bar's centreline, a constant channel is
guaranteed rather than eyeballed.

Each ribbon's inner boundary is two straight segments — one parallel to the bar,
one parallel to the cross — meeting at the fold apex. The outer boundary carries
the taper. `marks.py` documents every parameter; changing a channel width or a
taper is a one-line edit and a re-run.

    python3 -c "import marks; open('x.svg','w').write(marks.mark_svg('refit-crisp'))"

## Colour

Palette unchanged from brand-kit v1, with one recommended change: the ribbon ramp
starts 42% along its own length (`marks.LIFT`). The ramp's first stop `#12303F`
and the ink bar `#0E2F38` are 8 RGB units apart, so where the ribbon runs beside
the bar the channel disappears. Starting the ramp later fixes it without adding a
colour that isn't already in the palette.

## Typefaces tested

30 families at matched x-height. Shortlist: Archivo, Geist, Space Grotesk,
DM Sans, Sora, Familjen Grotesk. All are SIL Open Font Licence.
