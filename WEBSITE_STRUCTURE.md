# 개인 웹페이지 프로젝트 구조 (2026)

이 문서는 현재 리포지터리 상태를 기준으로 폴더 구조, 라우팅, 공통 시스템을 요약합니다. 과거 개편 내용이나 사용하지 않는 규칙은 제거했습니다.

## 프로젝트 개요
- **프로젝트명**: mywebpage
- **유형**: React 기반 개인 학술 웹사이트
- **배포**: GitHub Pages (`npm run deploy`)
- **개발자**: Hyunseung Lim

## 기술 스택
- React 18 (CRA 기반)
- React Router DOM 7 (`BrowserRouter` + `basename={process.env.PUBLIC_URL || '/'}`)
- Context API + 커스텀 훅
- CSS 모듈 없이 전역/페이지별 CSS

## 디렉토리 구조
```
Hyunseung-Lim.github.io/
├── public/
│   ├── PDF/                # 논문 PDF
│   ├── bib/                # BibTeX 원본
│   ├── icons/              # 공용 아이콘 (ProjectLinks, BibtexCard 등)
│   ├── images/             # 메인 배너 등 정적 이미지
│   ├── movies/             # Off-record 페이지용 포스터
│   └── projects/           # 프로젝트별 아이콘·배너·스크린샷
├── src/
│   ├── App.js              # 전역 라우터
│   ├── Components/         # Topbar, Footer, ThemeToggle, PageLoader, BibtexCard, ProjectLinks 등
│   ├── Data/               # publications.json, personLinks.json, projectsMeta.js
│   ├── Pages/
│   │   ├── MainPage.js, ProjectsPage.js, ResearchPage.js, about.js, publications.js
│   │   ├── Projects/       # Datopia, Aqua, Feed-O-Meter 등 상세 페이지 + ProjectTemplate.js
│   │   └── OffRecords/     # Movie/Writing/Fashion/Cook/HipHop/Penguin
│   ├── constants/          # 배너 이미지, 캐러셀 설정
│   ├── contexts/           # ThemeContext
│   ├── hooks/              # useFadeInAnimation, useInfiniteCarousel, useProjectPageFrame, useAssetPreloader
│   └── styles/             # project-pages.css 등 전역 스타일
├── package.json
└── README.md
```

## 라우팅 개요 (`src/App.js`)
모든 경로는 `BrowserRouter` 내부에서 렌더링되며(`basename`은 `process.env.PUBLIC_URL`), 라우트는 다음과 같습니다.

```jsx
<Routes>
  <Route path="/" element={<MainPage />} />
  <Route path="/about" element={<About />} />
  <Route path="/research" element={<ResearchPage />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/projects/{slug}" element={<ProjectComponent />} />  // datopia, aqua, feed-o-meter 등
  <Route path="/publications" element={<Publications />} />
  <Route path="/off-records/{topic}" element={<OffRecordPage />} /> // movie, writing, fashion, cook, hip-hop, penguin
</Routes>
```

각 Off-record 페이지는 `OffRecordLayout`을 공유하며, `public/movies`에 있는 이미지를 `PageLoadGuard`로 선로딩합니다.

## 공통 시스템
| 기능 | 위치 | 설명 |
| --- | --- | --- |
| 테마 | `src/contexts/ThemeContext.js`, `Components/ThemeToggle` | 라이트/다크 모드, 로컬스토리지 저장, body 클래스 토글 |
| 스크롤 초기화 | `Components/ScrollToTop.js` | Hash 경로 변경 시 `window.scrollTo(0,0)` |
| 자산 선로딩 | `hooks/useAssetPreloader`, `Components/PageLoader/PageLoadGuard` | 이미지 배열을 받아 로딩 UX 제공 |
| 페이드 인 | `hooks/useFadeInAnimation` + `.fade-in-element` (project-pages.css) | IntersectionObserver 기반 opacity/translate 전환 |
| 프로젝트 프레임 | `hooks/useProjectPageFrame` | 상세 페이지 레이아웃, 배너 스크롤 감지, 테마 강제 여부 처리 |

## 데이터 소스 (`src/Data`)
- `projectsMeta.js`: 프로젝트 카드와 상세 페이지 모두가 사용하는 단일 메타데이터.
  - `PROJECTS[id]`는 `title`, `subtitle`, `period`, `projectType`, 아이콘 경로, 라우팅 정보, `themeMode` 등을 포함합니다.
  - `PROJECT_ORDER` 배열 순서대로 Projects 페이지에서 타일을 렌더링합니다.
- `publications.json` + `personLinks.json`: Publications 페이지 필터와 저자 링크에 사용됩니다.
  - `field` 태그는 `hai`, `creativity`, `learning`, `ethics`, `others` 등으로 통일되어 있으며 과거의 `llm` 태그는 전부 `hai`에 병합되었습니다.

## 페이지 설명
- **MainPage**: DIS 2024 배너 캐러셀(`useInfiniteCarousel`)과 Topbar/Footer만으로 구성. 초기 두 장을 `PageLoadGuard`로 미리 불러옵니다.
- **ProjectsPage / projects.js**:
  - 데스크톱에서는 Diagram/Grid 토글(세그먼트 버튼) 제공, 모바일(`≤768px`)은 Grid 고정.
  - 다이어그램 배치는 `DIAGRAM_PLACEMENT`와 SVG 타원(`projects-diagram-overlay`)로 제어.
  - Hover 아이콘은 다크/라이트 모드별로 자동 교체.
- **프로젝트 상세 페이지**:
  - `ProjectTemplate.js`를 복제해 사용하며 `PageLoadGuard`, `Topbar`, `project-header`, `ProjectLinks`, `BibtexCard`, `Footer` 순서를 유지합니다.
  - `project-page--{slug}` 클래스와 전역 `project-pages.css` 규칙을 이용해 레이아웃·타이포그래피를 통일합니다.
  - 필요 시 개별 CSS에서 배너/커스텀 컴포넌트만 정의합니다.
- **Publications**: 필터(분야/타입/First Author) + 연도 그룹 + Fade-in. 저자명은 `personLinks`를 바탕으로 자동 링크 처리.
  - 모바일 필드 토글은 `All / HAI / Creativity / Others`로, 데스크톱에서는 `All / HAI / Creativity / Learning / AI Ethics / Others`를 제공합니다.
  - 타입 토글은 모바일에서 `All / First Author / Full Paper / Others`, 데스크톱에서 `All / First Author / Conference / Journal / Poster / Workshop` 구성입니다.
  - 데이터는 `useMemo` 기반 필터링으로 실시간 계산하며, LLM 관련 연구는 모두 HAI 필터 결과에 포함됩니다.
- **About/Research**: 기존 섹션 레이아웃과 애니메이션을 유지하며, 공통 `Topbar`/`Footer`를 재사용합니다.
- **Off-record**: `OffRecordLayout`이 프로젝트 상세 페이지와 동일한 프레임을 재활용하며, 섹션 콘텐츠만 각 주제별 파일에서 정의합니다.

## 새 프로젝트 추가 절차
1. `ProjectTemplate.js`를 복사해 `src/Pages/Projects/{NewProject}/{NewProject}.js`를 생성합니다.
2. `PROJECTS`와 `PROJECT_ORDER`에 메타데이터/노출 순서를 추가합니다.
3. 필요한 정적 자산을 `public/projects/{new-project}/`에 배치하고, 상세 페이지 최상단의 `PROJECT_ASSETS` 배열에 모두 나열해 `PageLoadGuard`에 전달합니다.
4. 공통 클래스(`project-section`, `section-text`, `section-title`, `project-divider--header`)를 우선 사용하고, 정말 필요한 경우에만 `{slug}.css`에 추가 규칙을 작성합니다.

## 스크립트 & 배포
```jsonc
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```
`npm run deploy`는 `gh-pages` 패키지를 사용해 `build/` 산출물을 GitHub Pages 브랜치에 푸시합니다.
