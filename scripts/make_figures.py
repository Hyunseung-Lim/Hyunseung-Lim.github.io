#!/usr/bin/env python3
"""Generate in-page project figures as WebP.

FIGURES maps <slug>/<name> to the maximum output width. The source PNG lives in
assets/figures/<slug>/<name>.png; the output is public/projects/<slug>/<name>.webp.
Alpha is preserved when the source uses it (dark-themed pages rely on it), the
image is never upscaled, and the aspect ratio is kept.

    python3 scripts/make_figures.py            # every figure in FIGURES
    python3 scripts/make_figures.py datopia    # one project
"""
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = os.path.join(ROOT, 'assets', 'figures')
PUBLIC = os.path.join(ROOT, 'public', 'projects')
WEBP_QUALITY = 82

# max width in px ≈ 3× the widest CSS box the figure is shown in
FIGURES = {
    'datopia/interface': 1200,    # .datopia-figures 2-column grid inside the 824px container
    'datopia/exhibition': 1200,
    # Elevate: application/hardware tiles (1125x600 sources shown ≤ ~400px wide) and hardware detail strips (full 824px width)
    **{f'elevate/{n}': 1125 for n in ('app1', 'app2', 'app3', 'app4', 'hard1', 'hard2', 'hard3', 'hard4')},
    **{f'elevate/{n}_detail': 1600 for n in ('hard1', 'hard2', 'hard3', 'hard4')},
}


def uses_alpha(image):
    return image.mode in ('RGBA', 'LA') and image.getchannel('A').getextrema()[0] < 255


def build(key, max_width):
    slug, name = key.split('/')
    source = os.path.join(SOURCES, slug, f'{name}.png')
    if not os.path.exists(source):
        print(f'  {key:24s} source missing: {os.path.relpath(source, ROOT)}')
        return
    image = Image.open(source)
    image = image.convert('RGBA') if uses_alpha(image) else image.convert('RGB')
    if image.width > max_width:
        image = image.resize((max_width, round(image.height * max_width / image.width)), Image.LANCZOS)
    output = os.path.join(PUBLIC, slug, f'{name}.webp')
    image.save(output, 'WEBP', quality=WEBP_QUALITY, method=6)
    print(f'  {key:24s} {os.path.getsize(source) // 1024:5d} KB png -> {image.width}x{image.height} '
          f'{"rgba" if image.mode == "RGBA" else "rgb "} {name}.webp {os.path.getsize(output) // 1024:4d} KB')


if __name__ == '__main__':
    wanted = sys.argv[1:]
    for key, width in FIGURES.items():
        if not wanted or key.split('/')[0] in wanted:
            build(key, width)
