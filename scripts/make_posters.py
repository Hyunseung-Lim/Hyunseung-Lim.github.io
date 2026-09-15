#!/usr/bin/env python3
"""Generate the Movie off-record posters as WebP.

Sources: assets/movies/<year>/<name>.png (800x1200 exports). Output:
public/movies/<year>/<name>.webp, capped at MAX_WIDTH (posters render at most
240 CSS px wide, so 800 px ≈ 3x) and flattened to RGB.

    python3 scripts/make_posters.py         # every poster
    python3 scripts/make_posters.py 2025    # one year
"""
import glob
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = os.path.join(ROOT, 'assets', 'movies')
PUBLIC = os.path.join(ROOT, 'public', 'movies')
MAX_WIDTH = 800
WEBP_QUALITY = 82


def build(year):
    out_dir = os.path.join(PUBLIC, year)
    os.makedirs(out_dir, exist_ok=True)
    total_in = total_out = 0
    for source in sorted(glob.glob(os.path.join(SOURCES, year, '*.png'))):
        name = os.path.splitext(os.path.basename(source))[0]
        image = Image.open(source).convert('RGB')
        if image.width > MAX_WIDTH:
            image = image.resize((MAX_WIDTH, round(image.height * MAX_WIDTH / image.width)), Image.LANCZOS)
        output = os.path.join(out_dir, f'{name}.webp')
        image.save(output, 'WEBP', quality=WEBP_QUALITY, method=6)
        total_in += os.path.getsize(source); total_out += os.path.getsize(output)
        print(f'  {year}/{name:42s} {os.path.getsize(source) // 1024:5d} KB -> {os.path.getsize(output) // 1024:4d} KB')
    print(f'  {year} total {total_in // 1024} KB -> {total_out // 1024} KB')


if __name__ == '__main__':
    years = sys.argv[1:] or sorted(d for d in os.listdir(SOURCES) if os.path.isdir(os.path.join(SOURCES, d)))
    for year in years:
        build(year)
