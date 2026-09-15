#!/usr/bin/env python3
"""Generate the Projects list-view thumbnails.

Source per project: assets/thumbnail-sources/<slug>.(png|jpg), or a page asset
listed in SOURCE_OVERRIDES. The image is never cropped: transparent margins are
trimmed, the rest is flattened on white and resized (non-uniformly) to 800x480
(5:3), then written as public/projects/<slug>/thumbnail.webp.

    python3 scripts/make_thumbnails.py            # all projects
    python3 scripts/make_thumbnails.py crafteam   # one project
"""
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = os.path.join(ROOT, 'assets', 'thumbnail-sources')
PUBLIC = os.path.join(ROOT, 'public', 'projects')
SIZE = (800, 480)          # 5:3, displayed at 300x180 CSS px (≈2.7x headroom)
WEBP_QUALITY = 82
SOURCE_OVERRIDES = {       # thumbnails that reuse an image already shipped with the page
    'feed-o-meter': 'public/projects/feed-o-meter/ui.png',
    'panorama': 'public/projects/panorama/curation.png',
}


def find_source(slug):
    if slug in SOURCE_OVERRIDES:
        return os.path.join(ROOT, SOURCE_OVERRIDES[slug])
    for ext in ('png', 'jpg', 'jpeg', 'webp'):
        candidate = os.path.join(SOURCES, f'{slug}.{ext}')
        if os.path.exists(candidate):
            return candidate
    return None


def flatten(image):
    if image.mode in ('RGBA', 'LA'):
        alpha = image.getchannel('A')
        bbox = alpha.point(lambda v: 255 if v > 0 else 0).getbbox()
        if bbox and bbox != (0, 0, *image.size):
            image = image.crop(bbox)
        background = Image.new('RGB', image.size, (255, 255, 255))
        background.paste(image, mask=image.getchannel('A'))
        return background
    return image.convert('RGB')


def build(slug):
    source = find_source(slug)
    if not source:
        print(f'  {slug:14s} no source found, skipped')
        return
    image = flatten(Image.open(source))
    stretch = (SIZE[0] / image.width) / (SIZE[1] / image.height)
    output = os.path.join(PUBLIC, slug, 'thumbnail.webp')
    image.resize(SIZE, Image.LANCZOS).save(output, 'WEBP', quality=WEBP_QUALITY, method=6)
    print(f'  {slug:14s} {os.path.relpath(source, ROOT):48s} -> thumbnail.webp '
          f'{os.path.getsize(output) // 1024:3d} KB  (h-stretch x{stretch:.3f})')


if __name__ == '__main__':
    slugs = sys.argv[1:] or sorted(d for d in os.listdir(PUBLIC) if os.path.isdir(os.path.join(PUBLIC, d)))
    for slug in slugs:
        build(slug)
