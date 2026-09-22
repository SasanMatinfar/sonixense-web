"""SoniXense X — exact constructed geometry.

Frame: 200-unit box, centre (100,100), 45 deg arms.
  d1 = bar direction   "\"   top-left  -> bottom-right
  d2 = cross direction "/"   bottom-left -> top-right
Working coordinates are (p, q): p measured along d1, q along d2, origin at centre.
q is therefore the signed perpendicular distance from the bar's centreline, which
is what makes a constant gap trivial to guarantee.

Each ribbon is a folded band whose INNER boundary is two straight segments — one
exactly parallel to the bar, one exactly parallel to the cross — meeting at the
fold apex. The outer boundary carries the taper. The second ribbon is the first
rotated 180 deg about the centre, so the symmetry is exact by construction.

Every variant is auto-fitted to the 200 box afterwards, so they are all optically
the same size and can be compared honestly.
"""
import math

BOX = 200.0
S = math.sqrt(0.5)
D1 = (S, S)
D2 = (S, -S)

INK      = "#0E2F38"
INK_DEEP = "#071D23"
PAPER    = "#F7F7F5"
MIST     = "#E4E7E8"
SLATE    = "#5C6E75"
RAMP      = ["#12303F", "#5A4870", "#A75B84", "#BC5560", "#AE462A"]
RAMP_DARK = ["#2E5468", "#7D6598", "#C57BA4", "#D4737C", "#C86241"]


# ---------------------------------------------------------------- primitives
def pq(p, q):
    return (p * D1[0] + q * D2[0], p * D1[1] + q * D2[1])


def add(a, b):  return (a[0] + b[0], a[1] + b[1])
def sub(a, b):  return (a[0] - b[0], a[1] - b[1])
def mul(a, k):  return (a[0] * k, a[1] * k)
def lerp(a, b, t): return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
def nrm(a):
    m = math.hypot(*a) or 1.0
    return (a[0] / m, a[1] / m)


class Poly:
    """A closed outline held as points + optional quadratic controls."""

    def __init__(self):
        self.seg = []          # ('L', pt) or ('Q', ctrl, pt)

    def move(self, p):
        self.seg = [('M', p)]
        return self

    def line(self, p):
        self.seg.append(('L', p)); return self

    def quad(self, c, p):
        self.seg.append(('Q', c, p)); return self

    def pts(self, n=18):
        out, cur = [], None
        for s in self.seg:
            if s[0] in ('M', 'L'):
                cur = s[1]; out.append(cur)
            else:
                a, c, b = cur, s[1], s[2]
                for i in range(1, n + 1):
                    t = i / n
                    u = 1 - t
                    out.append((u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
                                u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]))
                cur = b
        return out

    def d(self):
        def f(v): return f"{v:.3f}".rstrip("0").rstrip(".")
        out = []
        for s in self.seg:
            if s[0] == 'M':   out.append(f"M {f(s[1][0])} {f(s[1][1])}")
            elif s[0] == 'L': out.append(f"L {f(s[1][0])} {f(s[1][1])}")
            else:             out.append(f"Q {f(s[1][0])} {f(s[1][1])} "
                                         f"{f(s[2][0])} {f(s[2][1])}")
        return " ".join(out) + " Z"

    def rot180(self):
        r = Poly()
        for s in self.seg:
            if s[0] in ('M', 'L'): r.seg.append((s[0], mul(s[1], -1)))
            else:                  r.seg.append(('Q', mul(s[1], -1), mul(s[2], -1)))
        return r

    def xf(self, k, dx, dy):
        r = Poly()
        def t(p): return (p[0] * k + dx, p[1] * k + dy)
        for s in self.seg:
            if s[0] in ('M', 'L'): r.seg.append((s[0], t(s[1])))
            else:                  r.seg.append(('Q', t(s[1]), t(s[2])))
        return r


# ---------------------------------------------------------------------- parts
def make_bar(reach=118, half=7, taper=0.0, cut=0.0):
    """Straight arm on d1. taper narrows the +d1 end. cut skews the end faces."""
    P = Poly()
    h0, h1 = half * (1 + taper), half * (1 - taper)
    # skewed ends must form a parallelogram, not a trapezoid, or the bar stops
    # being its own 180-degree rotation
    a0, a1 = pq(-reach + cut, h0), pq(reach + cut, h1)
    b1, b0 = pq(reach - cut, -h1), pq(-reach - cut, -h0)
    return P.move(a0).line(a1).line(b1).line(b0)


def _ribbon_pts(gap, bar_half, p_tip, p_fold, q_end, w_up, w_low, end_cut,
                tip_lift):
    """The five defining points of a ribbon, in screen coords.

    The two limbs measure their width on different axes, which is the whole
    point of the shape: the limb that runs beside the bar is a wedge whose
    width grows in q, and the limb that runs out to the corner is a band of
    constant width in p.
    """
    qi = -(bar_half + gap)                        # inner edge, parallel to bar
    T1 = pq(p_tip, qi + tip_lift)                 # needle tip, top-left
    V = pq(p_fold, qi)                            # inner apex of the fold
    O = pq(p_fold - w_low, qi - w_up)             # outer corner of the fold
    T2a = pq(p_fold - w_low, q_end + end_cut)     # far terminal, outer
    T2b = pq(p_fold, q_end)                       # far terminal, inner
    return T1, V, O, T2a, T2b


def make_ribbon(gap=10.0, bar_half=6.0, p_tip=-116.0, p_fold=8.0, q_end=-106.0,
                w_up=30.0, w_low=44.0, outer="swoosh", bulge=0.16, lead=34.0,
                end_cut=0.0, tip_lift=0.0, apex_flat=0.0):
    """One folded ribbon — the left half of the pair.

    gap      constant clear channel between bar edge and ribbon inner edge
    p_tip    how far along -d1 the needle tip reaches
    p_fold   where along d1 the inner apex sits
    q_end    how far along -d2 the far terminal reaches
    w_up     width of the wedge limb, measured perpendicular to the bar
    w_low    width of the band limb, measured along the bar
    outer    'swoosh' flat against the bar then flaring | 'curve' evenly bowed
             | 'straight' a clean linear taper
    bulge    how far a 'curve' edge bows out, as a fraction of the T1->O run
    lead     for 'swoosh', how far before the notch the flare begins
    end_cut  skews the far terminal face
    apex_flat blunts the inner apex by this much (units)
    """
    T1, V, O, T2a, T2b = _ribbon_pts(gap, bar_half, p_tip, p_fold, q_end,
                                     w_up, w_low, end_cut, tip_lift)
    P = Poly().move(T1)

    # outer edge of the wedge limb: T1 -> O
    # 'swoosh' keeps the blade lying almost flat against the bar for most of its
    # run and flares only near the fold — which is what the original does, and
    # what stops the wedge and the chevron reading as two separate objects.
    if outer == "swoosh":
        P.quad(pq(p_fold - w_low - lead, -(bar_half + gap)), O)
    elif outer == "curve":
        mid = lerp(T1, O, 0.62)
        run = sub(O, T1)
        nout = nrm((run[1], -run[0]))
        if (nout[0] * (V[0] - mid[0]) + nout[1] * (V[1] - mid[1])) > 0:
            nout = mul(nout, -1)
        P.quad(add(mid, mul(nout, math.hypot(*run) * bulge)), O)
    else:
        P.line(O)

    P.line(T2a).line(T2b)
    if apex_flat > 0:
        d_up = nrm(sub(T1, V)); d_dn = nrm(sub(T2b, V))
        P.line(add(V, mul(d_dn, apex_flat))).line(add(V, mul(d_up, apex_flat)))
    else:
        P.line(V)
    return P


def make_facet(gap=10.0, bar_half=6.0, p_fold=8.0, q_end=-106.0, w_up=30.0,
               w_low=44.0, end_cut=0.0, **_):
    """The band limb alone, for showing the fold as a change of plane."""
    _, V, O, T2a, T2b = _ribbon_pts(gap, bar_half, 0, p_fold, q_end,
                                    w_up, w_low, end_cut, 0)
    return Poly().move(O).line(T2a).line(T2b).line(V)


# --------------------------------------------------------------------- fitting
def fit(parts, margin=8.0):
    """Scale + centre a list of (role, Poly) so the union fills the 200 box."""
    xs, ys = [], []
    for _, P in parts:
        for x, y in P.pts():
            xs.append(x); ys.append(y)
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    k = (BOX - 2 * margin) / max(w, h)
    dx = margin + (BOX - 2 * margin - w * k) / 2 - min(xs) * k
    dy = margin + (BOX - 2 * margin - h * k) / 2 - min(ys) * k
    return [(r, P.xf(k, dx, dy)) for r, P in parts]


# -------------------------------------------------------------------- variants
VARIANTS, ORDER = {}, []


def variant(key, title, family, note):
    def deco(fn):
        VARIANTS[key] = dict(key=key, title=title, family=family, note=note, fn=fn)
        ORDER.append(key)
        return fn
    return deco


def pair(rb):
    return [("sig", rb), ("sig", rb.rot180())]


# ---- I. same silhouette, drawn correctly ------------------------------------
@variant("refit", "Refit", "I · your mark, rebuilt",
         "The shape you have, reconstructed from exact geometry. Both inner edges are now "
         "dead parallel to the arms, so the channel beside the bar holds one constant width "
         "the whole way down — the single biggest reason the original reads soft.")
def _refit():
    rb = make_ribbon(gap=11, bar_half=6, p_tip=-126, p_fold=6, q_end=-110,
                     w_up=34, w_low=42, outer="swoosh", lead=44)
    return [("bar", make_bar(reach=128, half=6))] + pair(rb)


@variant("refit-crisp", "Crisp", "I · your mark, rebuilt",
         "Same silhouette with the bow taken out of the outer edge: the wedge limb becomes a "
         "straight taper to a hard corner. Reads as a folded plane rather than a blob.")
def _crisp():
    rb = make_ribbon(gap=11, bar_half=7, p_tip=-126, p_fold=6, q_end=-110,
                     w_up=34, w_low=42, outer="straight")
    return [("bar", make_bar(reach=128, half=7))] + pair(rb)


@variant("balance", "Balance", "I · your mark, rebuilt",
         "Refit with the bar brought up to a weight that can hold its own. Today an 11.7-unit "
         "hairline is asked to carry half the mark against a 42-unit band; at small sizes the "
         "bar is the first thing to break.")
def _balance():
    rb = make_ribbon(gap=12, bar_half=12, p_tip=-122, p_fold=7, q_end=-106,
                     w_up=32, w_low=40, outer="swoosh", lead=42)
    return [("bar", make_bar(reach=124, half=12))] + pair(rb)


# ---- II. sharpen -------------------------------------------------------------
@variant("blade", "Blade", "II · sharpened",
         "Leaner band, longer taper, tighter channel, every edge straight. The sharpest thing "
         "in the set and the one that survives best in a single colour.")
def _blade():
    rb = make_ribbon(gap=9, bar_half=8, p_tip=-128, p_fold=4, q_end=-118,
                     w_up=26, w_low=32, outer="straight")
    return [("bar", make_bar(reach=130, half=8))] + pair(rb)


@variant("chisel", "Chisel", "II · sharpened",
         "Every terminal cut on one angle, the way a broad-nib pen leaves them. One rule for "
         "all six ends, instead of the four different endings the traced mark has now.")
def _chisel():
    rb = make_ribbon(gap=10, bar_half=9, p_tip=-120, p_fold=6, q_end=-108,
                     w_up=32, w_low=40, outer="straight", end_cut=-13,
                     tip_lift=-9)
    return [("bar", make_bar(reach=122, half=9, cut=-11))] + pair(rb)


@variant("facet", "Facet", "II · sharpened",
         "The fold shown as a change of plane — the returning half of the ribbon catches light "
         "differently, the way a creased surface actually does.")
def _facet():
    kw = dict(gap=10, bar_half=8, p_fold=6, q_end=-108, w_up=32, w_low=38)
    rb = make_ribbon(p_tip=-124, outer="straight", **kw)
    fc = make_facet(**kw)
    return ([("bar", make_bar(reach=120, half=7))]
            + [("sig", rb), ("facet", fc)]
            + [("sig", rb.rot180()), ("facet", fc.rot180())])


# ---- III. make the X read faster --------------------------------------------
@variant("cross", "Cross", "III · X-first",
         "The fold pulled back to the centre so each ribbon’s apex sits against the bar at the "
         "crossing. The two arms lock together and the mark reads X before it reads anything "
         "else.")
def _cross():
    rb = make_ribbon(gap=9, bar_half=8, p_tip=-126, p_fold=-16, q_end=-122,
                     w_up=30, w_low=34, outer="straight")
    return [("bar", make_bar(reach=130, half=8))] + pair(rb)


@variant("beam", "Beam", "III · X-first",
         "The straight arm tapers like an emitted beam and the folded ribbon is the return. "
         "Transmit and receive drawn as two different things — the clearest statement of what "
         "the company actually does.")
def _beam():
    rb = make_ribbon(gap=11, bar_half=11, p_tip=-124, p_fold=6, q_end=-108,
                     w_up=32, w_low=40, outer="swoosh", lead=42)
    return [("bar", make_bar(reach=126, half=11, taper=0.68))] + pair(rb)


@variant("aperture", "Aperture", "III · X-first",
         "The channel between bar and ribbon opened up and held at one width throughout. The "
         "white line becomes the second arm; the mark is drawn as much by the gap as by the ink.")
def _aperture():
    rb = make_ribbon(gap=20, bar_half=9, p_tip=-118, p_fold=8, q_end=-100,
                     w_up=30, w_low=38, outer="straight")
    return [("bar", make_bar(reach=122, half=9))] + pair(rb)


def build(key, margin=8.0):
    return fit(VARIANTS[key]["fn"](), margin)


# -------------------------------------------------------------------- render
def _mix(a, b, t):
    A = [int(a[i:i+2], 16) for i in (1, 3, 5)]
    B = [int(b[i:i+2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(A[i] + (B[i]-A[i])*t):02X}" for i in range(3))


LIFT = 0.42   # start the ramp this far in, so the ribbon's dark end never
              # collides with the ink bar it runs beside


def grad(gid, dark=False, lift=None):
    ramp = list(RAMP_DARK if dark else RAMP)
    lift = LIFT if lift is None else lift
    if lift > 0:
        ramp[0] = _mix(ramp[0], ramp[1], lift)
    st = "".join(f'<stop offset="{i/(len(ramp)-1):.3f}" stop-color="{c}"/>'
                 for i, c in enumerate(ramp))
    return (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" '
            f'x1="10" y1="10" x2="190" y2="190">{st}</linearGradient>')


def mark_inner(key, mode="colour", idp="", margin=8.0):
    parts = build(key, margin)
    gid = f"{idp}{key}-{mode}"
    dark = mode == "dark"
    out = []
    if mode in ("colour", "dark"):
        out.append(f"<defs>{grad(gid, dark)}</defs>")
        sig, barc = f"url(#{gid})", (PAPER if dark else INK)
        fac, facop = (PAPER if dark else INK_DEEP), "0.30"
    elif mode == "ink":
        sig = barc = INK; fac, facop = PAPER, "0.30"
    elif mode == "white":
        sig = barc = PAPER; fac, facop = INK_DEEP, "0.30"
    else:
        sig = barc = "currentColor"; fac, facop = PAPER, "0.3"
    for role, P in parts:
        if role == "bar":
            out.append(f'<path d="{P.d()}" fill="{barc}"/>')
        elif role == "facet":
            out.append(f'<path d="{P.d()}" fill="{fac}" fill-opacity="{facop}"/>')
        else:
            out.append(f'<path d="{P.d()}" fill="{sig}"/>')
    return "".join(out)


def mark_svg(key, size=200, mode="colour", idp="", margin=8.0, bg=None):
    b = f'<rect width="200" height="200" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" '
            f'width="{size}" height="{size}">{b}{mark_inner(key, mode, idp, margin)}</svg>')


def ink_bbox(key, margin=8.0):
    """Tight bounding box of the drawn ink, in the 200-unit frame."""
    xs, ys = [], []
    for _, P in build(key, margin):
        for x, y in P.pts(28):
            xs.append(x); ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)
