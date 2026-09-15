#!/usr/bin/env python3
"""
Google Scholar 색인용 PDF 압축기 (5MB 제한 대응).

    python3 scripts/compress_pdf.py public/PDF/foo.pdf            # 제자리 압축 (원본은 .orig.pdf 로 보관되지 않음 → git 이 원본)
    python3 scripts/compress_pdf.py public/PDF/foo.pdf -o out.pdf  # 다른 경로로 출력
    python3 scripts/compress_pdf.py --check                        # public/PDF 에서 5MB 초과 파일만 나열

방법: 페이지에 포함된 래스터 이미지를 최대 1600px 로 줄이고 JPEG(q=72)로 재인코딩한다. 텍스트·벡터·폰트는 건드리지 않으므로
Scholar 가 읽는 1쪽 제목/저자 텍스트는 그대로다. 이미지가 아닌 요소(폰트, 첨부 파일)가 큰 PDF 는 줄어들지 않으며,
그 경우 Ghostscript(`gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook`) 등 다른 도구가 필요하다.

의존성: pypdf, Pillow  (pip install pypdf Pillow)
"""
import argparse
import os
import sys
from pathlib import Path

LIMIT = 5 * 1024 * 1024
ROOT = Path(__file__).resolve().parent.parent
PDF_DIR = ROOT / 'public' / 'PDF'


def flatten(im, Image):
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        return bg
    if im.mode not in ('RGB', 'L'):
        return im.convert('RGB')
    return im


def compress(src: Path, dst: Path, max_side: int, quality: int, min_kb: int) -> tuple[int, int, int]:
    from pypdf import PdfReader, PdfWriter
    from PIL import Image

    reader = PdfReader(str(src))
    writer = PdfWriter(clone_from=reader)
    replaced = 0
    for page in writer.pages:
        for im in list(page.images):
            try:
                pil = im.image
                w, h = pil.size
                if len(im.data) // 1024 < min_kb and max(w, h) <= max_side:
                    continue
                new = flatten(pil, Image)
                scale = min(1.0, max_side / max(w, h))
                if scale < 1.0:
                    new = new.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
                im.replace(new, quality=quality)
                replaced += 1
            except Exception as exc:  # keep going; one odd image must not abort the file
                print(f'  skip image {im.name}: {exc}', file=sys.stderr)
    for page in writer.pages:
        try:
            page.compress_content_streams()
        except Exception:
            pass
    try:
        writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
    except Exception:
        pass

    tmp = dst.with_suffix('.tmp.pdf')
    writer.write(str(tmp))

    # sanity: page count and first-page text must survive
    check = PdfReader(str(tmp))
    same_pages = len(check.pages) == len(reader.pages)
    same_text = (check.pages[0].extract_text() or '')[:200] == (reader.pages[0].extract_text() or '')[:200]
    if not (same_pages and same_text):
        tmp.unlink(missing_ok=True)
        raise RuntimeError(f'integrity check failed (pages={same_pages}, text={same_text})')
    os.replace(tmp, dst)
    return src.stat().st_size if src != dst else -1, dst.stat().st_size, replaced


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('pdfs', nargs='*', type=Path)
    ap.add_argument('-o', '--output', type=Path, help='output path (single input only)')
    ap.add_argument('--max-side', type=int, default=1600, help='longest image side in px (default 1600)')
    ap.add_argument('--quality', type=int, default=72, help='JPEG quality (default 72)')
    ap.add_argument('--min-kb', type=int, default=120, help='leave images smaller than this alone (default 120KB)')
    ap.add_argument('--check', action='store_true', help='only list PDFs in public/PDF over 5MB')
    args = ap.parse_args()

    if args.check or not args.pdfs:
        over = [(p, p.stat().st_size) for p in sorted(PDF_DIR.glob('*.pdf')) if p.stat().st_size > LIMIT]
        if not over:
            print('public/PDF: all files are under 5MB')
        for p, n in over:
            print(f'{n / 1048576:6.2f} MB  {p.relative_to(ROOT)}   (> 5MB, Scholar will not index)')
        return 1 if over else 0

    if args.output and len(args.pdfs) != 1:
        ap.error('-o works with exactly one input')

    rc = 0
    for src in args.pdfs:
        dst = args.output or src
        before = src.stat().st_size
        try:
            _, after, replaced = compress(src, dst, args.max_side, args.quality, args.min_kb)
        except Exception as exc:
            print(f'{src}: FAILED ({exc})')
            rc = 1
            continue
        flag = 'OK' if after <= LIMIT else 'STILL > 5MB (images are not the bulk; try Ghostscript)'
        print(f'{src.name}: {before / 1048576:.2f} MB -> {after / 1048576:.2f} MB  ({replaced} images re-encoded)  {flag}')
        if after > LIMIT:
            rc = 1
    return rc


if __name__ == '__main__':
    sys.exit(main())
