# SoniXense — Brand Kit v1.0

Everything here is built from the logo you supplied. The artwork was redrawn as true
vector: the wordmark is outlined (no font needed at the printer), the X mark is four
gradient-filled paths plus the straight bar, and the colour ramp was sampled from the
original file, so the kit matches the logo you already have rather than approximating it.

---

## Start here

| I need to… | Use |
|---|---|
| Put the logo on a website | `02-Web/code/logo-inline.html` or `01-Logo/SVG/sonixense-horizontal-colour.svg` |
| Send artwork to a printer | `01-Logo/PDF/` (vector, wordmark outlined) |
| Set up favicons | `02-Web/favicon/` — drop the folder at your web root, paste `head-snippet.html` |
| Order business cards | `03-Print/business-card/*.pdf` — 3 mm bleed, TrimBox set |
| Write a letter | `04-Office/SoniXense-Letterhead-A4.docx` |
| Build a deck | `04-Office/SoniXense-Presentation-Template.pptx` |
| Set an email signature | `02-Web/email-signature/` |
| Check a rule | `06-Guidelines/SoniXense-Brand-Guidelines.pdf` |

---

## Folder map

```
01-Logo/          SVG (masters) · PNG (transparent, 600–4800 px) · PDF (print vector)
02-Web/           favicon · social · email-signature · code (CSS + JSON tokens)
03-Print/         business-card · letterhead · envelope   (metric + imperial, 3 mm bleed)
04-Office/        Word letterhead (A4 + US Letter) · PowerPoint template (16:9)
05-Fonts/         Manrope · Inter · IBM Plex Mono, with OFL licences
06-Guidelines/    Brand guidelines, 9 pages, A4 landscape PDF
```

## The four lockups

- **Horizontal** — the default. Use it wherever it fits.
- **Stacked** — only when the space is squarer than 2:1.
- **Mark alone** — when the name is already present: avatars, app icons, favicons.
- **Wordmark alone** — footers, dense documents, anywhere the mark would be lost.

Each comes in five colourways: `colour`, `on-dark`, `ink` (single colour), `white`
(reversed), `black` (stamps, fax, single-plate print).

## Colour

| Name | Hex | RGB | CMYK |
|---|---|---|---|
| Ink | `#0E2F38` | 14 47 56 | 75 16 0 78 |
| Ink Deep | `#071D23` | 7 29 35 | 80 17 0 86 |
| Paper | `#F7F7F5` | 247 247 245 | 0 0 1 3 |
| Mist | `#E4E7E8` | 228 231 232 | 2 0 0 9 |
| Slate | `#5C6E75` | 92 110 117 | 21 6 0 54 |
| Slate Light | `#8C9CA1` | 140 156 161 | 13 3 0 37 |
| Indigo | `#12303F` | 18 48 63 | 71 24 0 75 |
| Plum | `#5A4870` | 90 72 112 | 20 36 0 56 |
| Orchid | `#A75B84` | 167 91 132 | 0 46 21 35 |
| Coral | `#BC5560` | 188 85 96 | 0 55 49 26 |
| Ember | `#AE462A` | 174 70 42 | 0 60 76 32 |

Accessible accent: `#8A4A6E` on light (6.4:1) · `#DA9BBB` on ink (7.8:1).
CMYK figures are unmanaged conversions — ask your printer for a proof before a long run.

## Type

Manrope (display) · Inter (text) · IBM Plex Mono (figures, specs, contact lines).
All three are SIL OFL and included in `05-Fonts/`.

## Clear space & minimum size

Clear space = **x**, half the height of the lowercase letters in the wordmark.
Minimums: horizontal 30 mm / 120 px · stacked 22 mm / 90 px · mark 6 mm / 24 px.
Below 32 px use `sonixense-mark-colour-compact.svg`.

---

## Two things to confirm

1. **`sonixense.com`** is used as the web address on the card, letterhead, envelope,
   e-mail signature and deck. If the domain is different, tell me and I will re-cut
   every file.
2. **No phone number or postal address** is printed anywhere — none was supplied.
   German business letters usually need an imprint line (company form, register number,
   managing director) in the letterhead footer; send those details and I will add them.

Everything is generated from scripts, so a change to a colour, a size or a line of text
is a re-run, not a redraw.
