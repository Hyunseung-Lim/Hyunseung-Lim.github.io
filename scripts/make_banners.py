#!/usr/bin/env python3
"""Generate the project header banners as WebP.

Sources: assets/banner-sources/<slug>.png and <slug>_mobile.png (full-resolution
exports). Each is downscaled to at most MAX_WIDTH px wide (never upscaled, aspect
ratio kept, alpha preserved when the source uses it) and written to
public/projects/<slug>/banner.webp and banner_mobile.webp.

    python3 scripts/make_banners.py            # all banners
    python3 scripts/make_banners.py elevate    # one project
"""
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = os.path.join(ROOT, 'assets', 'banner-sources')
PUBLIC = os.path.join(ROOT, 'public', 'projects')
MAX_WIDTH = {'': 2560, '_mobile': 1440}   # desktop: 1280 CSS px @2x; mobile: ≤640 CSS px @2x (+ 3x headroom)
WEBP_QUALITY = 80


def uses_alpha(image):
    if image.mode not in ('RGBA', 'LA'):
        return False
    return image.getchannel('A').getextrema()[0] < 255


def build(slug, variant):
    source = os.path.join(SOURCES, f'{slug}{variant}.png')
    if not os.path.exists(source):
        return
    image = Image.open(source)
    image = image.convert('RGBA') if uses_alpha(image) else image.convert('RGB')
    limit = MAX_WIDTH[variant]
    if image.width > limit:
        image = image.resize((limit, round(image.height * limit / image.width)), Image.LANCZOS)
    output = os.path.join(PUBLIC, slug, f'banner{variant}.webp')
    image.save(output, 'WEBP', quality=WEBP_QUALITY, method=6)
    print(f'  {slug + variant:22s} {os.path.getsize(source) // 1024:5d} KB png -> '
          f'{image.width}x{image.height} {"rgba" if image.mode == "RGBA" else "rgb "} '
          f'banner{variant}.webp {os.path.getsize(output) // 1024:4d} KB')


if __name__ == '__main__':
    slugs = sys.argv[1:] or sorted({f.split('_')[0].rsplit('.', 1)[0] for f in os.listdir(SOURCES) if f.endswith('.png')})
    for slug in slugs:
        for variant in MAX_WIDTH:
            build(slug, variant)
