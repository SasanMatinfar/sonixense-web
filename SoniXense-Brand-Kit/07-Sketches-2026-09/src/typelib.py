"""Outline text as SVG paths, shaped with HarfBuzz, normalised on x-height."""
import io, os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
import uharfbuzz as hb

FONTDIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")


class Face:
    def __init__(self, path, axes=None, label=None):
        self.label = label or os.path.basename(path)
        tt = TTFont(path)
        if "fvar" in tt and axes:
            loc = {}
            for a in tt["fvar"].axes:
                if a.axisTag in axes:
                    loc[a.axisTag] = max(a.minValue, min(a.maxValue, axes[a.axisTag]))
            if loc:
                tt = instancer.instantiateVariableFont(tt, loc, inplace=False,
                                                       updateFontNames=False)
        buf = io.BytesIO()
        tt.save(buf)
        self.data = buf.getvalue()
        self.tt = TTFont(io.BytesIO(self.data))
        self.upem = self.tt["head"].unitsPerEm
        self.glyphset = self.tt.getGlyphSet()
        os2 = self.tt["OS/2"]
        self.xheight = getattr(os2, "sxHeight", None) or int(self.upem * 0.52)
        self.capheight = getattr(os2, "sCapHeight", None) or int(self.upem * 0.70)
        self.ascender = self.tt["hhea"].ascender
        self.descender = self.tt["hhea"].descender
        self.hbfont = hb.Font(hb.Face(self.data))
        self.hbfont.scale = (self.upem, self.upem)

    # ---- shaping -------------------------------------------------------
    def shape(self, text, features=None):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.hbfont, buf, features or {})
        order = self.tt.getGlyphOrder()
        out = []
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            out.append((order[info.codepoint], pos.x_offset, pos.y_offset, pos.x_advance))
        return out

    def glyph_path(self, name, tx, ty, scale):
        """SVG 'd' for one glyph, y-flipped into screen coords."""
        pen = SVGPathPen(self.glyphset, ntos=lambda v: f"{v:.3f}")
        tpen = TransformPen(pen, Transform(scale, 0, 0, -scale, tx, ty))
        self.glyphset[name].draw(tpen)
        return pen.getCommands()

    # ---- layout --------------------------------------------------------
    def run(self, text, xheight_px, tracking_em=0.0, x=0.0, baseline=0.0,
            per_glyph=False, features=None):
        """Set `text` so its x-height equals xheight_px. Returns (d, width, parts)."""
        s = xheight_px / self.xheight
        track = tracking_em * self.upem
        ds, parts, pen_x = [], [], 0.0
        for gname, xo, yo, adv in self.shape(text, features):
            gx = x + (pen_x + xo) * s
            gy = baseline - yo * s
            d = self.glyph_path(gname, gx, gy, s)
            if d:
                ds.append(d)
                if per_glyph:
                    parts.append({"g": gname, "d": d, "x": gx, "adv": adv * s})
            pen_x += adv + track
        width = (pen_x - track) * s if len(text) else 0.0
        return " ".join(ds), width, parts

    def measure(self, text, xheight_px, tracking_em=0.0, features=None):
        s = xheight_px / self.xheight
        track = tracking_em * self.upem
        pen_x = 0.0
        for _, _, _, adv in self.shape(text, features):
            pen_x += adv + track
        return (pen_x - track) * s

    @property
    def cap_over_x(self):
        return self.capheight / self.xheight


CATALOG = [
    # label, file, axes, category
    ("Manrope",        "Manrope[wght].ttf",                    {"wght": 600}, "geometric humanist"),
    ("DM Sans",        "DMSans[opsz,wght].ttf",                {"wght": 500, "opsz": 40}, "geometric"),
    ("Outfit",         "Outfit[wght].ttf",                     {"wght": 500}, "geometric"),
    ("Poppins",        "Poppins-Medium.ttf",                   None,          "geometric"),
    ("Urbanist",       "Urbanist[wght].ttf",                   {"wght": 600}, "geometric"),
    ("Figtree",        "Figtree[wght].ttf",                    {"wght": 600}, "geometric humanist"),
    ("Plus Jakarta",   "PlusJakartaSans[wght].ttf",            {"wght": 600}, "geometric humanist"),
    ("Lexend",         "Lexend[wght].ttf",                     {"wght": 500}, "geometric humanist"),
    ("Onest",          "Onest[wght].ttf",                      {"wght": 600}, "neo-grotesque"),
    ("Geist",          "Geist[wght].ttf",                      {"wght": 600}, "neo-grotesque"),
    ("Inter",          "Inter[opsz,wght].ttf",                 {"wght": 600, "opsz": 28}, "neo-grotesque"),
    ("Archivo",        "Archivo[wdth,wght].ttf",               {"wght": 600, "wdth": 100}, "grotesque"),
    ("Chivo",          "Chivo[wght].ttf",                      {"wght": 600}, "grotesque"),
    ("Public Sans",    "PublicSans[wght].ttf",                 {"wght": 600}, "grotesque"),
    ("Work Sans",      "WorkSans[wght].ttf",                   {"wght": 600}, "grotesque"),
    ("Schibsted",      "SchibstedGrotesk[wght].ttf",           {"wght": 600}, "grotesque"),
    ("Familjen Grot",  "FamiljenGrotesk[wght].ttf",            {"wght": 600}, "grotesque"),
    ("Instrument",     "InstrumentSans[wdth,wght].ttf",        {"wght": 600, "wdth": 100}, "grotesque"),
    ("Rethink",        "RethinkSans[wght].ttf",                {"wght": 600}, "grotesque"),
    ("Epilogue",       "Epilogue[wght].ttf",                   {"wght": 600}, "contemporary grotesque"),
    ("Space Grotesk",  "SpaceGrotesk[wght].ttf",               {"wght": 600}, "technical"),
    ("IBM Plex Sans",  "IBMPlexSans[wdth,wght].ttf",           {"wght": 600, "wdth": 100}, "technical"),
    ("Barlow",         "Barlow-Medium.ttf",                    None,          "technical"),
    ("Chakra Petch",   "ChakraPetch-Medium.ttf",               None,          "technical"),
    ("Anybody",        "Anybody[wdth,wght].ttf",               {"wght": 600, "wdth": 100}, "technical"),
    ("Red Hat Disp",   "RedHatDisplay[wght].ttf",              {"wght": 600}, "display"),
    ("Sora",           "Sora[wght].ttf",                       {"wght": 600}, "display"),
    ("Bricolage",      "BricolageGrotesque[opsz,wdth,wght].ttf", {"wght": 600, "wdth": 100, "opsz": 24}, "display"),
    ("Syne",           "Syne[wght].ttf",                       {"wght": 600}, "display"),
    ("Unbounded",      "Unbounded[wght].ttf",                  {"wght": 500}, "display"),
]

_cache = {}


def get(label):
    if label not in _cache:
        for lb, fn, axes, cat in CATALOG:
            if lb == label:
                _cache[label] = Face(os.path.join(FONTDIR, fn), axes, lb)
                break
        else:
            raise KeyError(label)
    return _cache[label]


def all_faces():
    return [(lb, cat, get(lb)) for lb, fn, axes, cat in CATALOG]
