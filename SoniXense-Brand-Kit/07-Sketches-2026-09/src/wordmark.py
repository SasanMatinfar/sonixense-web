"""soniXense lockups: outlined type + the constructed mark in the X slot."""
import typelib as T, marks as MK

def esc(s): return s.replace("&","&amp;").replace("<","&lt;")

def word_paths(face, xh, tracking, x0, base):
    d, w, parts = face.run("sonixense", xh, tracking, x=x0, baseline=base,
                           per_glyph=True)
    return parts, w

def specimen(label, xh=54, tracking=-0.02, x0=0, base=0, ink=MK.INK,
             accent="#A75B84"):
    """Plain 'sonixense' with the x picked out — for comparing letterforms."""
    f = T.get(label)
    parts, w = word_paths(f, xh, tracking, x0, base)
    out = []
    for p in parts:
        col = accent if p["g"] in ("x", "x.alt") else ink
        out.append(f'<path d="{p["d"]}" fill="{col}"/>')
    return "".join(out), w


def lockup(label, mark_key, xh=84, tracking=-0.024, mode="colour",
           mark_scale=2.02, slot_pad=0.15, idp="", x0=0, base=0):
    """Full logo: the word outlined, the mark set into the x slot.

    mark_scale  mark ink height as a multiple of x-height
    slot_pad    side bearing each side, as a fraction of the mark's ink width
    """
    f = T.get(label)
    parts, _ = word_paths(f, xh, tracking, 0, 0)
    xi = next(i for i, p in enumerate(parts) if p["g"] in ("x", "x.alt"))

    x0b, y0b, x1b, y1b = MK.ink_bbox(mark_key)
    k = (mark_scale * xh) / (y1b - y0b)
    mw = (x1b - x0b) * k
    slot = mw * (1 + 2 * slot_pad)

    shift = slot - parts[xi]["adv"]           # widen the x's slot
    left = [p for p in parts[:xi]]
    right = [p for p in parts[xi + 1:]]

    def move(d, dx):
        # paths are absolute M/L/Q/C — shift by re-emitting with a transform
        return f'<g transform="translate({dx:.3f},0)">{d}</g>'

    ink = MK.PAPER if mode in ("white", "dark") else MK.INK
    body = ["".join(f'<path d="{p["d"]}" fill="{ink}"/>' for p in left)]
    body.append(move("".join(f'<path d="{p["d"]}" fill="{ink}"/>' for p in right),
                     shift))

    mx = parts[xi]["x"] + (slot - mw) / 2 - x0b * k
    my = -xh / 2 - (mark_scale * xh) / 2 - y0b * k     # centre on the x's middle
    body.append(f'<g transform="translate({mx:.3f},{my:.3f}) scale({k:.5f})">'
                f'{MK.mark_inner(mark_key, mode, idp=idp)}</g>')

    width = parts[-1]["x"] + parts[-1]["adv"] + shift - parts[0]["x"]
    g = (f'<g transform="translate({x0 - parts[0]["x"]:.3f},{base:.3f})">'
         + "".join(body) + "</g>")
    return g, width


def lockup_svg(label, mark_key, xh=84, mode="colour", pad=44, **kw):
    g, w = lockup(label, mark_key, xh=xh, mode=mode, idp=f"{label}-", **kw)
    f = T.get(label)
    top = f.ascender / f.upem * xh / (f.xheight / f.upem) * 0
    h = xh * 2.02 + 2 * pad
    body = (f'<g transform="translate({pad},{h/2 + xh/2})">{g}</g>')
    bg = MK.INK_DEEP if mode in ("white", "dark") else MK.PAPER
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w + 2*pad:.0f}" '
            f'height="{h:.0f}" viewBox="0 0 {w + 2*pad:.3f} {h:.3f}">'
            f'<rect width="100%" height="100%" fill="{bg}"/>{body}</svg>')
