#!/usr/bin/env python3
"""Generate the home-page banner slides as WebP.

Sources: assets/home-slides/<event>/imgN.(jpg|png). Output:
public/images/banner/<event>/imgN.webp, kept at source resolution (1080x566, the
slider is at most 960 CSS px wide) and flattened to RGB.

    python3 scripts/make_slides.py             # every event
    python3 scripts/make_slides.py facct2025   # one event
"""
import glob
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = os.path.join(ROOT, 'assets', 'home-slides')
PUBLIC = os.path.join(ROOT, 'public', 'images', 'banner')
MAX_WIDTH = 1920
WEBP_QUALITY = 82


def build(event):
    out_dir = os.path.join(PUBLIC, event)
    os.makedirs(out_dir, exist_ok=True)
    total_in = total_out = 0
    for source in sorted(glob.glob(os.path.join(SOURCES, event, 'img*.*'))):
        name = os.path.splitext(os.path.basename(source))[0]
        image = Image.open(source).convert('RGB')
        if image.width > MAX_WIDTH:
            image = image.resize((MAX_WIDTH, round(image.height * MAX_WIDTH / image.width)), Image.LANCZOS)
        output = os.path.join(out_dir, f'{name}.webp')
        image.save(output, 'WEBP', quality=WEBP_QUALITY, method=6)
        total_in += os.path.getsize(source); total_out += os.path.getsize(output)
    print(f'  {event:10s} {total_in // 1024:6d} KB -> {total_out // 1024:5d} KB  ({len(glob.glob(os.path.join(out_dir, "*.webp")))} slides)')


if __name__ == '__main__':
    events = sys.argv[1:] or sorted(d for d in os.listdir(SOURCES) if os.path.isdir(os.path.join(SOURCES, d)))
    for event in events:
        build(event)
