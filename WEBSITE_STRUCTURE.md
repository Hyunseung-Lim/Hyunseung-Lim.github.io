# 개인 웹페이지 프로젝트 구조 및 문서

## 프로젝트 개요
- **프로젝트명**: mywebpage
- **유형**: React 기반 개인 학술 웹사이트
- **배포**: GitHub Pages (`gh-pages`)
- **개발자**: Hyunseung Lim

## 기술 스택
- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 7.2.0
- **Build Tool**: Create React App
- **Package Manager**: npm
- **배포**: gh-pages

## 프로젝트 디렉토리 구조
```
Hyunseung-Lim.github.io/
├── public/                    # 정적 파일들
│   ├── PDF/                  # 논문 PDF 파일들
│   ├── bib/                  # BibTeX 파일들
│   ├── icons/                # 아이콘 파일들
│   ├── images/               # 이미지 파일들
│   │   └── banner/           # 배너 이미지들
│   │       └── dis2024/      # DIS 2024 컨퍼런스 배너 이미지들
│   └── projects/             # 프로젝트별 아이콘 및 미디어
│       ├── aqua/
│       ├── aqua-design/
│       ├── brownie/
│       ├── crafteam/
│       ├── datopia/
│       ├── elevate/
│       ├── feed-o-meter/
│       ├── panorama/
│       └── stereohunter/
├── src/                      # 소스 코드
│   ├── Components/           # 재사용 가능한 컴포넌트들
│   │   ├── Footer/           # 푸터 컴포넌트
│   │   ├── SegmentedButton/  # 세그먼트 버튼 컴포넌트
│   │   ├── ThemeToggle/      # 테마 토글 컴포넌트
│   │   ├── Topbar/           # 상단 네비게이션 바
│   │   ├── MobileScreenRail/ # 모바일 화면 레일 컴포넌트
│   │   ├── ScrollToTop.js    # 라우팅 전환 시 스크롤 초기화
│   │   ├── BibtexCard/       # BibTeX 복사 카드 (본문, 아이콘, 복사 상태 관리)
│   │   └── components.css    # 공통 레이아웃 및 섹션 스타일
│   ├── Data/                # 데이터 파일들
│   │   ├── publications.json # 논문 데이터
│   │   └── personLinks.json # 인물명 ↔ 외부 링크 매핑
│   │   └── projectsMeta.js  # 프로젝트 메타데이터 (그리드/상세 공통)
│   ├── Pages/               # 페이지 컴포넌트들
│   │   ├── MainPage.js      # 메인 페이지
│   │   ├── ProjectsPage.js  # 프로젝트 페이지
│   │   ├── ResearchPage.js  # 연구 페이지
│   │   ├── publications.js  # 논문 목록 페이지
│   │   └── Projects/         # 개별 프로젝트 페이지들
│   │       ├── Aqua/
│   │       ├── AquaDesign/
│   │       ├── Brownie/
│   │       ├── Crafteam/
│   │       ├── Datopia/
│   │       ├── Elevate/
│   │       ├── FeedOMeter/
│   │       ├── Panorama/
│   │       ├── StereoHunter/
│   │       └── ProjectTemplate.js  # 새 프로젝트용 레퍼런스
│   ├── constants/           # 상수 정의
│   ├── contexts/            # React Context들
│   │   └── ThemeContext.js  # 테마 컨텍스트
│   ├── hooks/               # 커스텀 훅들
│   │   ├── useFadeInAnimation.js
│   │   ├── useInfiniteCarousel.js
│   │   └── useProjectPageFrame.js
│   ├── styles/              # 스타일 파일들
│   ├── App.js               # 메인 앱 컴포넌트
│   └── index.js            # 엔트리 포인트
├── build/                   # 빌드된 파일들
└── node_modules/           # 의존성 패키지들
```

## 주요 컴포넌트 및 기능

### 1. 라우팅 구조 (`src/App.js:10-34`)
```javascript
<Routes>
  <Route path='/' element={<MainPage />} />
  <Route path='/research' element={<ResearchPage />} />
  <Route path='/projects' element={<ProjectsPage />} />
  <Route path='/projects/datopia' element={<DatopiaProject />} />
  <Route path='/projects/feed-o-meter' element={<FeedOMeterProject />} />
  <Route path='/projects/crafteam' element={<CrafteamProject />} />
  <Route path='/projects/stereohunter' element={<StereoHunterProject />} />
  <Route path='/projects/elevate' element={<ElevateProject />} />
  <Route path='/projects/aqua' element={<AquaProject />} />
  <Route path='/projects/aqua-design' element={<AquaDesignProject />} />
  <Route path='/projects/panorama' element={<PanoramaProject />} />
  <Route path='/projects/brownie' element={<BrownieProject />} />
  <Route path='/publications' element={<Publications />} />
</Routes>
```

### 2. 테마 시스템 (`src/contexts/ThemeContext.js`)
- **다크/라이트 모드 지원**
- **로컬 스토리지 저장**
- **전역 상태 관리**
- Context API를 통한 테마 상태 관리

### 3. 스크롤 초기화 (`src/Components/ScrollToTop.js`)
- 해시 라우트가 변경될 때마다 `window.scrollTo`를 호출해 화면을 항상 최상단으로 이동
- `Router` 내부에 전역으로 배치돼 모든 페이지 전환에 적용

### 4. 인터랙티브 모바일 레일 (`src/Components/MobileScreenRail/`)
- 프로젝트 상세 페이지에서 모바일 스크린 모음을 수평 스크롤로 전시
- 포인터 드래그, 스크롤 휠, 모멘텀 애니메이션을 지원해 자연스러운 조작감 제공
- 컨테이너 폭을 계산해 좌우 스페이서를 자동 조정하고, 텍스트/메타데이터 영역을 옵션으로 표시

### 5. 데이터 구조

#### 논문 데이터 (`src/Data/publications.json`)
```json
{
  "title": "논문 제목",
  "author": "저자들",
  "venue": "학회/저널명",
  "award": "수상내역",
  "year": 연도,
  "field": ["분야1", "분야2"],
  "type": "타입(conference/journal/poster/workshop/preprint)",
  "pdf": "PDF 파일명",
  "doi": "DOI 링크",
  "bibtex": "BibTeX 파일명",
  "recording": "녹화 링크",
  "video": "비디오 링크"
}
```

#### 프로젝트 메타데이터 (`src/Data/projectsMeta.js`)
```javascript
export const PROJECTS = {
  datopia: {
    id: 'datopia',
    title: 'Datopia',
    subtitle: '선택사항',
    period: 'YYYY',
    projectType: 'Research|Exhibition|Design Project',
    icon: '/projects/datopia/icon.png',         // 라이트 모드 기본 아이콘
    hoverIcon: '/projects/datopia/icon_hover.gif',
    iconDark: null,                             // 다크 모드 전용 아이콘 (선택)
    hoverIconDark: null,
    href: '#/projects/datopia',                 // 내부 링크 또는 외부 URL
    external: false,
    themeMode: 'dark'                           // 'auto' | 'light' | 'dark' (선택)
  },
  // ...
};

export const PROJECT_ORDER = [
  'crafteam',
  'panorama',
  'feed-o-meter',
  'aqua',
  'datopia',
  'stereohunter',
  'brownie',
  'elevate',
  'aqua-design'
];
```
- `PROJECTS`: 프로젝트 카드 및 상세 페이지에 필요한 모든 메타 정보를 보관하는 맵.
- `PROJECT_ORDER`: Projects 페이지 카드 노출 순서를 제어하는 배열.
- `iconDark`·`hoverIconDark`: 다크 모드에 특화된 아이콘이 있을 때만 설정(없으면 `null`).
- `themeMode`: 개별 프로젝트 페이지에서 강제로 적용할 테마가 있을 때 사용 (`'auto'`가 기본값).
- `external`이 `true`일 경우 개별 페이지 대신 외부 링크로 연결.
- `subtitle` 값은 선택 사항이지만, 스토리텔링을 강화하려면 프로젝트 데이터에 추가하는 것을 권장합니다.
- `status` 필드는 2025년 9월 26일부로 완전히 제거되었습니다. 필요한 경우 본문에서 직접 설명하세요.

### 4. 주요 페이지 컴포넌트

#### MainPage (`src/Pages/MainPage.js`)
- **무한 이미지 캐러셀** (DIS 2024 컨퍼런스 이미지)
- **페이드인 애니메이션**
- **반응형 디자인**
#### Projects 페이지 (`src/Pages/projects.js`)
- **아이콘 기반 프로젝트 그리드**: `PROJECT_ORDER` 순서(Crafteam → Panorama → Feed-O-Meter → AQUA → Datopia → StereoHunter → Brownie → Elevate → Aqua Design)를 유지
- **다크/라이트 전용 아이콘 자동 전환** (`ThemeContext` 상태에 따라 세트 교체)
- **모든 카드**: Datopia, Feed-O-Meter, Crafteam, StereoHunter, Elevate, AQUA, Aqua Design, Brownie, PANORAMA 모두 자체 상세 페이지(`#/projects/...`)로 이동
- **중앙 페이드인 시스템**: `useFadeInAnimation(0.1)`으로 모든 카드 동일 타이밍의 페이드 인 적용
- **호버 자산 제어**: `data-hover` 속성과 공통 핸들러로 정리, 필요 시 다크 모드 전용 아이콘 사용
- **지연 로딩**: 모든 프로젝트 아이콘에 `loading="lazy"` 적용
- **데이터 소스**: `src/Data/projectsMeta.js`의 `PROJECTS` 맵과 `PROJECT_ORDER` 배열을 참조해 아이콘/링크/메타 정보를 일괄 관리

#### Publications 페이지 (`src/Pages/publications.js`)
- **다중 필터링 시스템**:
  - 분야별 필터 (HAI, LLM, Creativity, Learning, AI Ethics, Others)
  - 타입별 필터 (First Author, Conference, Journal, Poster, Workshop, Preprint)
- **연도별 그룹핑**
- **인터섹션 옵저버를 통한 스크롤 애니메이션**
- **반응형 세그먼트 컨트롤**
- **저자 하이퍼링크 자동 처리**: `personLinks.json` 매핑 기반으로 저자 이름에 외부 링크 적용 (모바일 truncation 포함)

### 5. 커스텀 훅들

#### `useInfiniteCarousel` (`src/hooks/useInfiniteCarousel.js`)
- 무한 스크롤 이미지 캐러셀 구현
- 자동 슬라이드 기능
- 부드러운 전환 효과

#### `useFadeInAnimation` (`src/hooks/useFadeInAnimation.js`)
- 요소가 뷰포트에 들어올 때 페이드인 효과
- 재사용 가능한 애니메이션 훅
- `.fade-in-element` 기반의 중앙 제어 시스템을 단일 타이밍으로 적용
- 레거시 `.animation` 클래스 경로 제거로 코드 단순화 및 유지보수성 향상

#### `useProjectPageFrame` (`src/hooks/useProjectPageFrame.js`)
- 프로젝트 상세 페이지 진입 시 스크롤을 최상단으로 이동
- 배너 존재 여부에 따라 `has-banner` / `scrolled-past-banner` 클래스를 토글해 헤더 스타일을 제어
- `themeMode` 값(`auto`/`light`/`dark`)을 받아 페이지 생애주기 동안 테마를 강제하고 언마운트 시 복구
- Topbar에서 테마 토글을 숨겨야 할지 여부를 반환

### 6. 네비게이션 (`src/Components/Topbar/topbar.js`)
- **반응형 햄버거 메뉴**
- **테마 토글 버튼**
- **해시 라우팅** (#/ 형태)

## 주요 기능들

### 1. 논문 필터링 시스템
- **분야별 필터링**: HAI, LLM, Creativity, Learning, AI Ethics, Others
- **퍼블리케이션 타입별 필터링**: Conference, Journal, Poster, Workshop, Preprint
- **First Author 필터링**: "Hyunseung Lim"으로 시작하는 저자 필드 필터링
- **동적 연도 리스트 업데이트**: 필터링된 결과에 따라 연도 목록 자동 업데이트

### 2. 반응형 디자인
- **모바일/데스크톱 대응**
- **브레이크포인트**: 992px 기준
- **모바일에서 축약된 저자 표시**: 6명 이상일 때 "and N more authors" 형태로 축약

### 3. 애니메이션 시스템
- **스크롤 기반 페이드인 애니메이션**
- **인터섹션 옵저버 활용**
- **부드러운 이미지 캐러셀 전환**

## 스크립트 명령어
```json
{
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

## 배포 정보
- **플랫폼**: GitHub Pages
- **빌드 디렉토리**: `build/`
- **자동 배포**: `npm run deploy` 명령어로 빌드 후 gh-pages 브랜치에 배포

## 상수 설정 (`src/constants/index.js`)
- **캐러셀 설정**: 자동 슬라이드 간격(5초), 전환 시간(1초)
- **배너 이미지**: DIS 2024 컨퍼런스 이미지 7장
- **네비게이션 링크**: About Me, Projects, Publications

## 개발 패턴
1. **함수형 컴포넌트 + 훅스 패턴**
2. **Context API를 통한 상태 관리**
3. **커스텀 훅을 통한 로직 재사용**
4. **JSON 데이터 기반 동적 콘텐츠**
5. **CSS 클래스 기반 스타일링**

## 새로운 프로젝트 템플릿 시스템 (2025년 9월 24일 추가)

### 개별 프로젝트 페이지 구조
각 프로젝트 페이지는 이제 공통 컴포넌트를 사용하지 않고, 다음 구조를 따릅니다:

```
src/Pages/Projects/
├── ProjectTemplate.js      # 공통 구조 정의 (복제용)
└── [ProjectName]/
    ├── [ProjectName].js     # Topbar/배너/본문/푸터까지 직접 렌더링
    └── [ProjectName].css    # 프로젝트별 세부 스타일
```
- `ProjectTemplate.js`는 새 프로젝트를 만들 때 복제할 수 있는 참조용 컴포넌트로, 공통 구조와 훅 사용법이 모두 포함되어 있습니다.

### 공통 동작
1. **배너 & 스크롤 감지**: 각 페이지에서 `useProjectPageFrame` 훅을 호출해 60vh 배너 높이, 투명 Topbar, 스크롤 전환을 제어합니다.
2. **테마 강제 적용**: `themeMode` 값(`auto`/`light`/`dark`)을 훅에 전달해 진입 시 테마를 강제하고, 언마운트 시 원상 복구합니다.
3. **미니멀 디자인 유지**: `.project-section`, `.section-title`, `.section-text` 등 공통 클래스는 `src/Components/components.css`에서 정의되며, 필요한 경우에만 각 프로젝트 폴더의 CSS에서 덮어씁니다.
4. **페이드인 제어**: 헤더와 본문 섹션 모두 각 페이지에서 `useFadeInAnimation`을 직접 호출해 ref를 연결합니다.
5. **페이지별 스코프 클래스**: 각 상세 페이지는 루트 컨테이너에 `project-page--{projectId}` 클래스를 추가하고, CSS에서도 해당 접두사로 모든 규칙을 네임스페이스합니다(예: `.project-page--datopia .project-section`). 새로운 프로젝트를 추가할 때도 동일한 규칙을 따라야 다른 페이지와 스타일이 섞이지 않습니다.

### 현재 제공 중인 프로젝트 페이지
- **Datopia** (`/projects/datopia`): 다크 모드 고정, 배너 + 애니메이션 배경
- **Feed-O-Meter** (`/projects/feed-o-meter`): 공통 섹션 구성 + BibTeX 카드
- **Aqua Design** (`/projects/aqua-design`): 테마별 배너 전환, YouTube 임베드, `MobileScreenRail` 사용
- **PANORAMA** (`/projects/panorama`): 데이터셋 개요와 BibTeX를 포함한 전용 상세 페이지
- **Crafteam**, **AQUA**, **Brownie**, **Elevate**, **StereoHunter** 등 나머지 프로젝트도 동일한 템플릿 구조와 페이드인 시스템을 공유

### 라우팅 시스템 업데이트
- 기존: `/projects` (전체 프로젝트 목록)
- 추가: `/projects/[project-name]` (개별 프로젝트 페이지)
- 메인 프로젝트 페이지에서 각 프로젝트로 링크 연결

### 현재 구현된 프로젝트
- **Crafteam** (`/projects/crafteam`): 협업 워크숍 기록, 공통 CSS 클래스를 활용해 구성.
- **StereoHunter** (`/projects/stereohunter`): 인간-LLM 협업 시 고정관념 탐지 워크플로 연구, 바이어스 시각화 실험 요약.
- **PANORAMA** (`/projects/panorama`): 데이터셋/벤치마크 설명과 BibTeX 카드, HuggingFace 링크 포함.
- **Feed-O-Meter** (`/projects/feed-o-meter`): 디자인 피드백 역할극 연구, 참여자 링크 자동 매핑.
- **AQUA** (`/projects/aqua`): 설치형 프로젝트 개요, 데이터 스토리텔링 강조.
- **Datopia** (`/projects/datopia`): 다크 모드 전용, 배너 + `dato2.gif` 애니메이션 배경.
- **Brownie** (`/projects/brownie`): 반응형 `<picture>` 배너 + 단일 YouTube 임베드(기본 플레이어 UI 사용).
- **Elevate** (`/projects/elevate`): 대형 워커블 핀 어레이 설치 프로젝트, 기본 템플릿 기반.
- **Aqua Design** (`/projects/aqua-design`): AQUA 확장 버전, 프로젝트 템플릿 재사용.

> 모든 개별 프로젝트 페이지는 `PROJECTS`(src/Data/projectsMeta.js)에서 메타 정보를 불러와 직접 Topbar/헤더/본문 블록을 구성합니다.

### 스타일 & 애니메이션 가이드
- 전역 레이아웃, 타이포그래피, 헤더/본문 divider, 페이드인 규칙 등은 `WEBSITE_STYLE.md`에서 관리합니다.
  - `.project-divider` 및 `.project-divider--header` 사용법, 전역 `.section-text`/`section-text--small` 크기, 헤더 보더 제거 등 최근 작업 내용이 모두 포함되어 있습니다.
- 페이드인 문제 해결이나 ref 사용 가이드는 `FADEIN_GUIDE.md`를 참고하세요.

## 향후 수정 시 주의사항
1. **데이터 추가**: `src/Data/` 폴더의 JSON 파일들 수정 (기존 시스템)
2. **새로운 프로젝트 추가**:
   - `src/Pages/Projects/[ProjectName]/` 폴더 생성
   - 프로젝트 컴포넌트와 스타일 파일 추가
   - `App.js`에 새 라우트 추가
3. **배너 이미지**: `public/images/` 폴더에 추가
4. **테마 설정**: 프로젝트별로 `themeMode` prop으로 테마 강제 설정 가능
5. **스타일 커스터마이징**: 필요한 경우에만 각 프로젝트 폴더에 CSS를 추가 (기본 섹션 스타일은 `src/Components/components.css`에서 제공)
6. **빌드 전 테스트**: `npm start`로 로컬 테스트 후 `npm run deploy`로 배포

## 기술적 특징
- **스크롤 이벤트 최적화**: useEffect를 통한 이벤트 리스너 관리
- **CSS 변수 활용**: 다크/라이트 모드 간 부드러운 전환
- **공통 스타일 재사용**: `ProjectTemplate.js`와 `components.css`를 통해 레이아웃을 통일하고, 로직은 각 프로젝트가 직접 제어
- **접근성 고려**: 적절한 alt 텍스트, focus state 제공

### 문제 해결 히스토리
- **Publication 페이지 딜레이**: 과거 `.animation` 클래스 기반 구현에서 발생한 전환 지연을 `.fade-in-element` 시스템으로 해결
- **Venue-text 문제**: 하드코딩된 색상값에서 CSS 변수 시스템으로 전환
- **복합 Transition 간섭**: opacity/transform 애니메이션과 색상 전환 분리로 해결
- **방향별 전환 차이**: 라이트→다크, 다크→라이트 양방향 동일한 transition 보장

### 유지보수 가이드
- **전환 속도 변경**: `--theme-transition-speed` 변수 하나만 수정
- **새로운 컴포넌트**: CSS 변수 사용시 자동으로 일관된 전환 적용
- **디버깅**: 2초 느린 전환(`transition: all 2s ease`)으로 테스트 가능

## Legacy 정리 & 최적화 (2025-09-26)
1. **Project Meta Status 제거**: `status` 필드를 완전히 삭제하고, 필요 시 본문 섹션에서 진행 상황을 기술하도록 정리했습니다.
2. **Period 우선 배치**: 상세 페이지 헤더의 메타 정보는 항상 Period → Project Type 순으로 노출됩니다.
3. **Subtitle 정비**: 가능한 프로젝트에 `subtitle`을 채워 제목 바로 아래 줄에서 내러티브를 강조하고, 누락된 경우에도 UI가 자연스럽게 동작하도록 정리했습니다.
4. **스크롤 초기화**: 개별 프로젝트 페이지 진입 시 스크롤을 항상 최상단으로 이동시켜, 이전 페이지에서 내려간 상태로 새로운 페이지가 부분만 보이던 레거시 문제를 제거했습니다.
5. **Aqua Design 전면 개편**:
   - `public/projects/aqua-design/thumbnail.png`, `thumbnail_dark.png`, `img1.png` 자산을 추가하고 테마별 배너를 자동 전환.
   - 좌측 이미지(85%) / 우측 본문(60% 비중)의 커스텀 섹션과 굵은 서브타이틀, 강조 텍스트를 도입.
   - Datopia 페이지와 동일한 패턴으로 YouTube 임베드(`https://www.youtube.com/embed/hctUpCzpNfU?si=0as3GUUX7a9Agss-`)를 추가.
   - 모바일에서는 텍스트 → 이미지 순으로 자동 재배치하고 이미지 폭을 75%로 축소해 가독성을 확보.
6. **문서 업데이트**: 본 문서에 최신 구조, 필드 변화, 레이아웃 규칙을 반영해 향후 유지보수시 혼선을 방지했습니다.
7. **Brownie 히어로 섹션 재정비 (2025-12-18)**:
   - `<picture>` 요소를 사용해 데스크톱/모바일 배너 이미지를 교체하고, 동일한 YouTube 임베드를 배치했습니다.
   - IFrame은 기본 컨트롤을 유지하며 자동 재생·커스텀 슬라이더는 사용하지 않습니다.
   - 모바일에서도 동일한 영상 프레임을 재사용하도록 내부 divider와 여백을 조정했습니다.
8. **프로젝트 링크 버튼 가이드 (2025-12-24)**:
   - `ProjectLinks` 컴포넌트로 Paper/GitHub/Dataset 등의 버튼을 `project-meta-info` 아래에 추가합니다.
   - 링크 버튼이 존재하는 프로젝트는 데스크톱 기준 `project-header`의 `padding-bottom`을 **1.5rem**으로 낮춰 헤더와 링크 사이 간격을 통일합니다. (모바일은 2rem 유지)
   - 새 프로젝트에서도 동일 규칙을 적용해, 링크 열을 추가할 때 별도의 여백 조정 없이 동일한 레이아웃을 재사용하세요.
9. **프로젝트 섹션 제목 통일 (2025-12-27)**:
   - 모든 프로젝트의 `section-title` 스타일을 `src/styles/project-pages.css`에서 단일 정의로 관리합니다.
   - 데스크톱 기준 `1.65rem`, 모바일(`≤480px`) 기준 `1.3rem` 폰트 크기를 공통 적용해 제목 타이포를 일관화했습니다.
   - 개별 프로젝트 CSS에 흩어져 있던 `.section-title` 규칙과 모바일 전용 보정은 제거했습니다.
10. **BibTeX 카드 & 모바일 레일 보강 (2025-12-27)**:
   - `BibtexCard`는 줄 단위 렌더링을 통해 `abstract` 행을 화면에서는 숨기되, 복사 텍스트에는 유지하도록 개선했습니다.
   - `mobile-screen-rail__heading`에 모바일 폰트 사이즈(1.25rem)를 추가해 프로젝트별 모바일 캐러셀 제목도 공통 타이포 범위 내에서 유지합니다.

---
*최종 업데이트: 2025년 12월 28일*
