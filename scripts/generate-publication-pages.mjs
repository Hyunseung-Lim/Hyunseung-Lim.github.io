#!/usr/bin/env node
/**
 * Google Scholar / 검색엔진용 정적 페이지 생성기
 *
 * 입력: src/Data/publications.json (+ public/bib/*.bib, public/PDF/*.pdf)
 * 출력(모두 build/ 아래, 저장소에는 커밋되지 않음):
 *   build/papers/<slug>.html        논문별 랜딩 페이지 (citation_* 메타 태그 포함)
 *   build/projects/<name>/index.html 프로젝트 페이지가 있는 논문은 그 경로가 랜딩 페이지가 됨
 *                                   (빌드된 index.html + citation_* 메타 + 프리렌더 본문, React가 로드되면 대체)
 *   build/publications/index.html  /publications 를 200으로 응답시키는 정적 목록 (React가 로드되면 대체됨)
 *   build/index.html                홈의 #root 에 순수 HTML 링크(최근 논문 · 프로젝트 랜딩 · Publications)를 주입.
 *                                   Scholar 크롤러는 JS 내비게이션을 따라가지 못하므로 홈 → 목록 → 논문 → PDF 가
 *                                   <a href> 만으로 이어져야 한다. React 마운트 시 교체되어 사람은 차이를 못 느낌.
 *   build/sitemap.xml               홈 · 목록 · 랜딩 페이지 · PDF 전체
 *
 * 경고: public/PDF 파일이 5MB 를 넘으면 Scholar 가 색인하지 않는다 ("Each file must not exceed 5MB").
 *       빌드 로그에 경고가 뜨면 `python3 scripts/compress_pdf.py public/PDF/<file>.pdf` 로 압축한다.
 *
 * `npm run build` 뒤에 postbuild 훅으로 자동 실행된다. 자세한 절차는 PUBLICATION_GUIDE.md 참고.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECTS } from '../src/Data/projectsMeta.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://hyunseunglim.com';
const SITE_NAME = 'Hyunseung Lim';
const DATA_FILE = path.join(ROOT, 'src/Data/publications.json');
const BIB_DIR = path.join(ROOT, 'public/bib');
const PDF_DIR = path.join(ROOT, 'public/PDF');
const BUILD_DIR = path.join(ROOT, 'build');
const BUILD_INDEX = path.join(BUILD_DIR, 'index.html');
const OUT_PAPERS_DIR = path.join(BUILD_DIR, 'papers');
const OUT_LIST = path.join(BUILD_DIR, 'publications', 'index.html');
const OUT_SITEMAP = path.join(BUILD_DIR, 'sitemap.xml');
const SCHOLAR_PDF_LIMIT = 5 * 1024 * 1024; // Google Scholar inclusion guidelines: files over 5MB are not indexed
const HOME_SENTINEL_OPEN = '<!--scholar-home-->';
const HOME_SENTINEL_CLOSE = '<!--/scholar-home-->';
const HOME_RECENT_COUNT = 5;

const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">`;

// ---------------------------------------------------------------- utils
const warnings = [];
const warn = (msg) => warnings.push(msg);

const escapeHtml = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const escapeXml = escapeHtml;

const slugify = (s) => String(s)
  .normalize('NFKD')
  .toLowerCase()
  .replace(/[^a-z0-9_-]+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const isoDate = (d) => new Date(d).toISOString().slice(0, 10);

// 최소한의 BibTeX 정리: 보호용 중괄호, 흔한 이스케이프만 처리
const cleanTex = (s) => String(s)
  .replace(/\s+/g, ' ')
  .replace(/\\&/g, '&').replace(/\\%/g, '%').replace(/\\_/g, '_').replace(/\\#/g, '#')
  .replace(/~/g, ' ')
  .replace(/---/g, '—').replace(/--/g, '–')
  .replace(/\\(?:emph|textit|textbf)\{([^}]*)\}/g, '$1')
  .replace(/[{}]/g, '')
  .trim();

// 단일 엔트리 .bib 파서 (중첩 중괄호 지원)
function parseBib(text) {
  const head = text.match(/@(\w+)\s*\{\s*([^,\s]*)\s*,/);
  if (!head) return null;
  const entry = { entryType: head[1].toLowerCase(), key: head[2], fields: {} };
  const n = text.length;
  let i = head.index + head[0].length;
  while (i < n) {
    while (i < n && /[\s,]/.test(text[i])) i++;
    if (i >= n || text[i] === '}') break;
    let j = i;
    while (j < n && /[\w-]/.test(text[j])) j++;
    const name = text.slice(i, j).toLowerCase();
    i = j;
    while (i < n && /\s/.test(text[i])) i++;
    if (text[i] !== '=') break;
    i++;
    while (i < n && /\s/.test(text[i])) i++;
    let value = '';
    if (text[i] === '{') {
      let depth = 0; let k = i;
      for (; k < n; k++) {
        if (text[k] === '{') depth++;
        else if (text[k] === '}') { depth--; if (depth === 0) break; }
      }
      value = text.slice(i + 1, k);
      i = k + 1;
    } else if (text[i] === '"') {
      let k = i + 1;
      while (k < n && text[k] !== '"') k++;
      value = text.slice(i + 1, k);
      i = k + 1;
    } else {
      let k = i;
      while (k < n && !/[,}\s]/.test(text[k])) k++;
      value = text.slice(i, k);
      i = k;
    }
    if (name) entry.fields[name] = cleanTex(value);
  }
  return entry;
}

function readBib(fileName) {
  const file = path.join(BIB_DIR, fileName);
  if (!fs.existsSync(file)) { warn(`bib 파일 없음: public/bib/${fileName}`); return null; }
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = parseBib(raw);
  if (!parsed) warn(`bib 파싱 실패: public/bib/${fileName}`);
  return parsed ? { ...parsed, raw: raw.trim() } : null;
}

const DOI_RE = /\b(10\.\d{4,9}\/[^\s"'<>#?]+)/i;
function extractDoi(...candidates) {
  for (const c of candidates) {
    if (!c) continue;
    const m = String(c).match(DOI_RE);
    if (m) return m[1].replace(/[.,;)]+$/, '');
  }
  return '';
}

const ARXIV_RE = /arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})(?:v\d+)?/i;
function extractArxivId(...candidates) {
  for (const c of candidates) {
    if (!c) continue;
    const m = String(c).match(ARXIV_RE);
    if (m) return m[1];
  }
  return '';
}

function splitPages(pages) {
  if (!pages) return {};
  const m = String(pages).match(/^\s*(\d+)\s*[-–—]+\s*(\d+)\s*$/);
  if (m) return { first: m[1], last: m[2] };
  const single = String(pages).match(/^\s*(\d+)\s*$/);
  return single ? { first: single[1] } : {};
}

function labelForExternal(url) {
  if (!url) return '';
  if (/arxiv\.org/i.test(url)) return 'arXiv';
  if (/doi\.org|dl\.acm\.org|sciencedirect|ieeexplore|aclanthology|neurips|openreview|springer|wiley/i.test(url)) return 'Publisher';
  return 'Link';
}

// ---------------------------------------------------------------- records
function buildRecords(pubs) {
  const seen = new Set();
  const records = [];
  pubs.forEach((pub, idx) => {
    if (!pub.title || !(Number(pub.year) > 0)) return; // 빈 템플릿 항목 등 건너뜀

    const bib = pub.bibtex ? readBib(pub.bibtex) : null;
    const f = bib?.fields ?? {};

    let slug = pub.pdf
      ? slugify(pub.pdf.replace(/\.pdf$/i, ''))
      : slugify(`${pub.title}-${pub.year}`).slice(0, 80);
    if (!slug) slug = `paper-${idx}`;
    let unique = slug; let k = 2;
    while (seen.has(unique)) unique = `${slug}-${k++}`;
    seen.add(unique);
    slug = unique;

    const authors = String(pub.author || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (authors.length === 0) warn(`저자 없음: ${pub.title}`);

    const isJournal = bib ? bib.entryType === 'article' : pub.type === 'journal';
    const venueFull = (isJournal ? f.journal : f.booktitle) || f.journal || f.booktitle || pub.venue || '';

    let pdfUrl = '';
    if (pub.pdf) {
      if (fs.existsSync(path.join(PDF_DIR, pub.pdf))) {
        pdfUrl = `${SITE_URL}/PDF/${encodeURI(pub.pdf)}`;
        const bytes = fs.statSync(path.join(PDF_DIR, pub.pdf)).size;
        if (bytes > SCHOLAR_PDF_LIMIT) {
          warn(`PDF ${(bytes / 1048576).toFixed(1)}MB > 5MB → Scholar 색인 불가: public/PDF/${pub.pdf} (python3 scripts/compress_pdf.py 로 압축)`);
        }
      }
      else warn(`PDF 파일 없음: public/PDF/${pub.pdf} (${pub.title})`);
    } else {
      warn(`PDF 미등록 (Scholar 색인 불가): ${pub.title}`);
    }

    const externalUrl = pub.doi || '';
    const doi = extractDoi(f.doi, f.url, externalUrl);
    const arxivId = extractArxivId(externalUrl, f.url, f.eprint, pub.link);
    const pages = splitPages(f.pages);
    const abstract = (pub.abstract || f.abstract || '').trim();
    const date = pub.date || String(pub.year); // YYYY/MM/DD 또는 YYYY

    records.push({
      slug,
      title: pub.title.trim(),
      authors,
      year: Number(pub.year),
      date,
      type: pub.type || (isJournal ? 'journal' : ''),
      isJournal,
      venueShort: pub.venue || '',
      venueFull,
      award: pub.award || '',
      pdfUrl,
      pdfFile: pdfUrl ? pub.pdf : '',
      externalUrl,
      externalLabel: labelForExternal(externalUrl),
      link: pub.link || '',
      video: pub.video || '',
      recording: pub.recording || '',
      doi,
      arxivId,
      publisher: f.publisher || '',
      volume: f.volume || '',
      issue: f.number || '',
      firstPage: pages.first || '',
      lastPage: pages.last || '',
      abstract,
      bibtexRaw: bib?.raw || '',
      bibtexFile: bib ? pub.bibtex : '',
      project: pub.project ? String(pub.project).replace(/\/+$/, '') : '',
      projectPrimary: pub.projectPrimary === true,
      landing: 'paper',
      pageUrl: `${SITE_URL}/papers/${slug}.html`,
    });
  });
  assignProjectLandings(records);
  return records;
}

// 프로젝트 페이지가 있는 논문은 /projects/<name>/ 을 랜딩 페이지로 쓴다.
// 여러 논문이 한 프로젝트를 공유하면 대표 논문 하나만(projectPrimary → conference → journal → 첫 항목).
function assignProjectLandings(records) {
  const byProject = new Map();
  for (const r of records) {
    if (!r.project) continue;
    if (!/^\/projects\/[a-z0-9-]+$/.test(r.project)) { warn(`project 경로 형식 오류 (예: /projects/crafteam): ${r.project}`); continue; }
    if (!byProject.has(r.project)) byProject.set(r.project, []);
    byProject.get(r.project).push(r);
  }
  for (const [route, group] of byProject) {
    const primary = group.find((r) => r.projectPrimary)
      || group.find((r) => r.type === 'conference')
      || group.find((r) => r.type === 'journal')
      || group[0];
    primary.landing = 'project';
    primary.pageUrl = `${SITE_URL}${route}/`;
    if (group.length > 1) {
      warn(`${route} 를 ${group.length}편이 공유 → 대표: "${primary.title}" (나머지는 /papers/ 에 생성)`);
    }
  }
}

// ---------------------------------------------------------------- templates
const PAPER_CSS = `
:root{color-scheme:light dark;--fg:#111;--muted:#6b6b6b;--bg:#fff;--line:#e4e4e4;--chip:#f3f3f3}
@media (prefers-color-scheme:dark){:root{--fg:#ececec;--muted:#9a9a9a;--bg:#111;--line:#2e2e2e;--chip:#1c1c1c}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;line-height:1.65;-webkit-font-smoothing:antialiased}
main{max-width:760px;margin:0 auto;padding:40px 24px 80px}
nav{font-size:14px}
nav a{color:var(--muted);text-decoration:none}
nav a+a{margin-left:16px}
nav a:hover{color:var(--fg)}
h1{font-size:26px;line-height:1.35;font-weight:600;margin:28px 0 14px}
.authors{font-size:16px;margin:0 0 6px}
.venue{color:var(--muted);margin:0 0 22px;font-size:15px}
.muted{color:var(--muted)}
.award{display:inline-block;margin-left:8px;padding:1px 8px;border:1px solid var(--line);border-radius:999px;font-size:12px}
.links{margin:0 0 8px}
.links a{display:inline-block;margin:0 8px 8px 0;padding:7px 14px;border:1px solid var(--line);border-radius:8px;text-decoration:none;color:var(--fg);font-size:14px;font-weight:500}
.links a.primary{background:var(--fg);color:var(--bg);border-color:var(--fg)}
h2{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600;margin:40px 0 10px}
.abstract{font-size:15.5px;text-align:justify}
pre{background:var(--chip);padding:16px;border-radius:10px;overflow-x:auto;font-size:12.5px;line-height:1.5;white-space:pre-wrap;word-break:break-word;margin:0}
footer{margin-top:56px;padding-top:20px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}
footer a{color:inherit}
`.trim();

function citationMeta(r) {
  const meta = [];
  const tag = (name, content) => { if (content) meta.push(`<meta name="${name}" content="${escapeHtml(content)}">`); };

  tag('citation_title', r.title);
  r.authors.forEach((a) => tag('citation_author', a));
  tag('citation_publication_date', r.date);
  tag(r.isJournal ? 'citation_journal_title' : 'citation_conference_title', r.venueFull);
  tag('citation_volume', r.volume);
  tag('citation_issue', r.issue);
  tag('citation_firstpage', r.firstPage);
  tag('citation_lastpage', r.lastPage);
  tag('citation_publisher', r.publisher);
  tag('citation_doi', r.doi);
  tag('citation_arxiv_id', r.arxivId);
  tag('citation_pdf_url', r.pdfUrl);
  tag('citation_abstract_html_url', r.pageUrl);
  tag('citation_language', 'en');
  return meta.join('\n');
}

function describe(r) {
  return r.abstract
    ? r.abstract.slice(0, 300).replace(/\s+\S*$/, '') + (r.abstract.length > 300 ? '…' : '')
    : `${r.authors.join(', ')}. ${r.venueFull}${r.year ? `, ${r.year}` : ''}.`;
}

function paperLinks(r, { includeProject = true } = {}) {
  const links = [];
  if (r.pdfUrl) links.push(`<a class="primary" href="${escapeHtml(r.pdfUrl)}">PDF</a>`);
  if (r.doi) links.push(`<a href="https://doi.org/${escapeHtml(r.doi)}" rel="noopener">DOI</a>`);
  else if (r.externalUrl) links.push(`<a href="${escapeHtml(r.externalUrl)}" rel="noopener">${escapeHtml(r.externalLabel)}</a>`);
  if (r.doi && r.externalUrl && !/doi\.org/i.test(r.externalUrl) && r.externalLabel !== 'Publisher') {
    links.push(`<a href="${escapeHtml(r.externalUrl)}" rel="noopener">${escapeHtml(r.externalLabel)}</a>`);
  }
  if (r.link) links.push(`<a href="${escapeHtml(r.link)}" rel="noopener">Website</a>`);
  if (r.video) links.push(`<a href="${escapeHtml(r.video)}" rel="noopener">Video</a>`);
  if (r.recording) links.push(`<a href="${escapeHtml(r.recording)}" rel="noopener">Recording</a>`);
  if (includeProject && r.project) links.push(`<a href="${escapeHtml(r.project)}/">Project page</a>`);
  if (r.bibtexRaw) links.push(`<a href="#bibtex">BibTeX</a>`);
  return links;
}

function venueLine(r) {
  return [escapeHtml(r.venueFull), r.year].filter(Boolean).join(', ')
    + (r.venueShort && r.venueShort !== r.venueFull ? ` <span class="muted">(${escapeHtml(r.venueShort)})</span>` : '')
    + (r.award ? `<span class="award">${escapeHtml(r.award)}</span>` : '');
}

function renderPaperPage(r) {
  const links = paperLinks(r);
  const description = describe(r);
  const venueLineHtml = venueLine(r);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(r.title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(r.pageUrl)}">
<link rel="icon" href="/favicon.ico">
${citationMeta(r)}
${FONT_LINKS}
<style>${PAPER_CSS}</style>
</head>
<body>
<main>
<nav><a href="/">${escapeHtml(SITE_NAME)}</a><a href="/publications/">Publications</a></nav>
<h1>${escapeHtml(r.title)}</h1>
<p class="authors">${r.authors.map(escapeHtml).join(', ')}</p>
<p class="venue">${venueLineHtml}</p>
<p class="links">${links.join('')}</p>
${r.abstract ? `<h2>Abstract</h2>\n<p class="abstract">${escapeHtml(r.abstract)}</p>` : ''}
${r.bibtexRaw ? `<h2 id="bibtex">BibTeX</h2>\n<pre>${escapeHtml(r.bibtexRaw)}</pre>` : ''}
<footer>© ${new Date().getFullYear()} ${escapeHtml(SITE_NAME)} · <a href="/publications/">All publications</a></footer>
</main>
</body>
</html>
`;
}

// 프로젝트 페이지용: 빌드된 index.html 에 citation 메타 + 프리렌더 본문을 주입. React 로드 후 실제 프로젝트 페이지로 교체됨.
function renderProjectPage(r, indexHtml) {
  if (!indexHtml.includes('<div id="root"></div>')) {
    throw new Error('build/index.html 에서 <div id="root"></div> 를 찾지 못했습니다.');
  }
  const links = paperLinks(r, { includeProject: false }).filter((l) => !l.includes('#bibtex'));
  const body = `<div class="prerender">
<style>${LIST_CSS}</style>
<nav><a href="/">${escapeHtml(SITE_NAME)}</a><a href="/publications/">Publications</a></nav>
<h1>${escapeHtml(r.title)}</h1>
<div class="a">${r.authors.map(escapeHtml).join(', ')}</div>
<div class="v">${venueLine(r)}</div>
<div class="l">${links.join('')}</div>
${r.abstract ? `<h2>Abstract</h2>\n<p>${escapeHtml(r.abstract)}</p>` : ''}
</div>`;
  const head = `<link rel="canonical" href="${escapeHtml(r.pageUrl)}">\n${citationMeta(r)}`;
  return indexHtml
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(r.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeHtml(describe(r))}"/>`)
    .replace('</head>', `${head}</head>`);
}

const LIST_CSS = `
.prerender{max-width:900px;margin:0 auto;padding:40px 24px 80px;font-family:Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;line-height:1.6}
.prerender nav a{color:inherit;opacity:.7;text-decoration:none;font-size:14px;margin-right:16px}
.prerender h1{font-size:26px;font-weight:600;margin:24px 0 8px}
.prerender h2{font-size:15px;font-weight:600;letter-spacing:.06em;margin:32px 0 8px;opacity:.7}
.prerender ul{list-style:none;padding:0;margin:0}
.prerender li{padding:12px 0;border-bottom:1px solid rgba(127,127,127,.25)}
.prerender li a.t{color:inherit;font-weight:600;text-decoration:none}
.prerender .a,.prerender .v{font-size:14px;opacity:.8}
.prerender .l a{font-size:13px;margin-right:12px;color:inherit}
`.trim();

function renderListMarkup(records) {
  const years = [...new Set(records.map((r) => r.year))].sort((a, b) => b - a);
  const groups = years.map((y) => {
    const items = records.filter((r) => r.year === y).map((r) => {
      const links = [];
      if (r.pdfUrl) links.push(`<a href="${escapeHtml(r.pdfUrl)}">PDF</a>`);
      if (r.doi) links.push(`<a href="https://doi.org/${escapeHtml(r.doi)}" rel="noopener">DOI</a>`);
      else if (r.externalUrl) links.push(`<a href="${escapeHtml(r.externalUrl)}" rel="noopener">${escapeHtml(r.externalLabel)}</a>`);
      return `<li>
<a class="t" href="${escapeHtml(r.pageUrl.replace(SITE_URL, ''))}">${escapeHtml(r.title)}</a>
<div class="a">${r.authors.map(escapeHtml).join(', ')}</div>
<div class="v">${escapeHtml(r.venueShort || r.venueFull)}${r.award ? ` · ${escapeHtml(r.award)}` : ''}</div>
<div class="l">${links.join('')}</div>
</li>`;
    });
    return `<h2>${y}</h2>\n<ul>\n${items.join('\n')}\n</ul>`;
  });
  return `<div class="prerender">
<style>${LIST_CSS}</style>
<nav><a href="/">${escapeHtml(SITE_NAME)}</a><a href="/about">About</a><a href="/projects">Projects</a></nav>
<h1>Publications</h1>
${groups.join('\n')}
</div>`;
}

function renderListPage(records, indexHtml) {
  if (!indexHtml.includes('<div id="root"></div>')) {
    throw new Error('build/index.html 에서 <div id="root"></div> 를 찾지 못했습니다.');
  }
  const canonical = `<link rel="canonical" href="${SITE_URL}/publications/">`;
  const description = `Publications by ${SITE_NAME}: ${records.length} papers on human-AI interaction, creativity support, and learning technologies.`;
  return indexHtml
    .replace('<div id="root"></div>', `<div id="root">${renderListMarkup(records)}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>Publications – ${escapeHtml(SITE_NAME)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeHtml(description)}"/>`)
    .replace('</head>', `${canonical}</head>`);
}

// 홈: 빌드된 index.html 의 #root 에 순수 HTML 링크를 주입. sentinel 주석으로 감싸 두어 재실행 시 원상복구 후 다시 주입한다.
function stripHomePrerender(indexHtml) {
  const re = new RegExp(`<div id="root">${HOME_SENTINEL_OPEN}[\\s\\S]*?${HOME_SENTINEL_CLOSE}</div>`);
  return indexHtml.replace(re, '<div id="root"></div>');
}

// The homepage prerender exists for crawlers that do not run JS (Scholar). Visitors with JS
// would otherwise see it flash until React mounts and replaces #root, so keep it in the DOM
// but off-screen. Scoped to #root so the static publication pages keep their visible layout.
const HOME_HIDE_CSS = '#root>.prerender{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}';

function renderHomeMarkup(records) {
  const recent = [...records]
    .sort((a, b) => (b.year - a.year) || a.title.localeCompare(b.title))
    .slice(0, HOME_RECENT_COUNT)
    .map((r) => {
      const pdf = r.pdfUrl ? `<a href="${escapeHtml(r.pdfUrl)}">PDF</a>` : '';
      return `<li><a class="t" href="${escapeHtml(r.pageUrl.replace(SITE_URL, ''))}">${escapeHtml(r.title)}</a>
<div class="v">${escapeHtml(r.venueShort || r.venueFull)}</div>
<div class="l">${pdf}</div></li>`;
    });
  const projectRoutes = [...new Set(records.filter((r) => r.landing === 'project').map((r) => r.project))];
  const projects = projectRoutes.map((route) => {
    const meta = Object.values(PROJECTS).find((pr) => pr.href === route);
    const label = meta?.title ?? route.replace('/projects/', '');
    const sub = meta?.subtitle ? ` <span class="v">— ${escapeHtml(meta.subtitle)}</span>` : '';
    return `<li><a class="t" href="${escapeHtml(route)}/">${escapeHtml(label)}</a>${sub}</li>`;
  });
  return `${HOME_SENTINEL_OPEN}<div class="prerender">
<style>${LIST_CSS}${HOME_HIDE_CSS}</style>
<nav><a href="/about">About</a><a href="/projects">Projects</a><a href="/publications/">Publications</a></nav>
<h1>${escapeHtml(SITE_NAME)}</h1>
<p class="a">PhD candidate, Department of Industrial Design, KAIST.</p>
<h2>Recent publications</h2>
<ul>
${recent.join('\n')}
</ul>
<p class="l"><a href="/publications/">All ${records.length} publications →</a></p>
<h2>Projects</h2>
<ul>
${projects.join('\n')}
</ul>
</div>${HOME_SENTINEL_CLOSE}`;
}

function renderHomePage(records, indexHtml) {
  if (!indexHtml.includes('<div id="root"></div>')) {
    throw new Error('build/index.html 에서 <div id="root"></div> 를 찾지 못했습니다.');
  }
  return indexHtml.replace('<div id="root"></div>', `<div id="root">${renderHomeMarkup(records)}</div>`);
}

function renderSitemap(records) {
  const dataMtime = isoDate(fs.statSync(DATA_FILE).mtime);
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: dataMtime },
    { loc: `${SITE_URL}/publications/`, lastmod: dataMtime },
  ];
  for (const r of records) {
    urls.push({ loc: r.pageUrl, lastmod: dataMtime });
    if (r.pdfFile) urls.push({ loc: r.pdfUrl, lastmod: isoDate(fs.statSync(path.join(PDF_DIR, r.pdfFile)).mtime) });
  }
  const body = urls.map((u) => `  <url><loc>${escapeXml(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// ---------------------------------------------------------------- main
function main() {
  if (!fs.existsSync(BUILD_INDEX)) {
    console.error(`[scholar-pages] ${path.relative(ROOT, BUILD_INDEX)} 가 없습니다. 먼저 \`npm run build\` 를 실행하세요.`);
    process.exit(1);
  }
  const pubs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const records = buildRecords(pubs);

  // scholar:pages 를 빌드 없이 재실행해도 동작하도록, 이전 실행이 홈에 주입한 블록은 먼저 걷어낸다.
  const indexHtml = stripHomePrerender(fs.readFileSync(BUILD_INDEX, 'utf8'));

  fs.rmSync(OUT_PAPERS_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_PAPERS_DIR, { recursive: true });
  const projectPages = [];
  for (const r of records) {
    if (r.landing === 'project') {
      const out = path.join(BUILD_DIR, r.project.replace(/^\//, ''), 'index.html');
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, renderProjectPage(r, indexHtml));
      projectPages.push(path.relative(BUILD_DIR, out));
    } else {
      fs.writeFileSync(path.join(OUT_PAPERS_DIR, `${r.slug}.html`), renderPaperPage(r));
    }
  }

  fs.mkdirSync(path.dirname(OUT_LIST), { recursive: true });
  fs.writeFileSync(OUT_LIST, renderListPage(records, indexHtml));
  fs.writeFileSync(OUT_SITEMAP, renderSitemap(records));
  fs.writeFileSync(BUILD_INDEX, renderHomePage(records, indexHtml));

  const withPdf = records.filter((r) => r.pdfUrl).length;
  const withAbs = records.filter((r) => r.abstract).length;
  console.log(`[scholar-pages] ${records.length} landing pages: ${records.length - projectPages.length} → build/papers/, ${projectPages.length} → project pages (PDF ${withPdf}, abstract ${withAbs})`);
  for (const pp of projectPages) console.log(`[scholar-pages]   ${pp}`);
  console.log(`[scholar-pages] build/publications/index.html, build/sitemap.xml 생성, build/index.html 에 홈 링크 주입`);
  for (const w of warnings) console.warn(`[scholar-pages] 경고: ${w}`);
}

main();
