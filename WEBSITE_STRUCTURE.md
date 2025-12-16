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
│       ├── crafteam/
│       ├── datopia/
│       ├── feed-o-meter/
│       └── panorama/
├── src/                      # 소스 코드
│   ├── Components/           # 재사용 가능한 컴포넌트들
│   │   ├── Footer/          # 푸터 컴포넌트
│   │   ├── SegmentedButton/ # 세그먼트 버튼 컴포넌트
│   │   ├── ThemeToggle/     # 테마 토글 컴포넌트
│   │   └── Topbar/          # 상단 네비게이션 바
│   ├── Data/                # 데이터 파일들
│   │   ├── publications.json # 논문 데이터
│   │   └── personLinks.json # 인물명 ↔ 외부 링크 매핑
│   │   └── projectsMeta.js  # 프로젝트 메타데이터 (그리드/상세 공통)
│   ├── Pages/               # 페이지 컴포넌트들
│   │   ├── MainPage.js      # 메인 페이지
│   │   ├── ProjectsPage.js  # 프로젝트 페이지
│   │   ├── ResearchPage.js  # 연구 페이지
│   │   ├── publications.js  # 논문 목록 페이지
│   │   └── Projects/        # 개별 프로젝트 페이지들
│   │       ├── Aqua/         # AQUA 전용 페이지
│   │       ├── Crafteam/     # Crafteam 전용 페이지
│   │       ├── Datopia/      # Datopia 전용 페이지
│   │       ├── FeedOMeter/   # Feed-O-Meter 전용 페이지
│   │       └── ProjectTemplate.{js,css}
│   ├── constants/           # 상수 정의
│   ├── contexts/            # React Context들
│   │   └── ThemeContext.js  # 테마 컨텍스트
│   ├── hooks/               # 커스텀 훅들
│   │   ├── useFadeInAnimation.js
│   │   └── useInfiniteCarousel.js
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
  <Route path='/projects/brownie' element={<BrownieProject />} />
  <Route path='/publications' element={<Publications />} />
</Routes>
```

### 2. 테마 시스템 (`src/contexts/ThemeContext.js`)
- **다크/라이트 모드 지원**
- **로컬 스토리지 저장**
- **전역 상태 관리**
- Context API를 통한 테마 상태 관리

### 3. 데이터 구조

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
    themeMode: 'dark',                          // 'auto' | 'light' | 'dark' (선택)
    participants: ['Hyunseung Lim', '...'],     // 참여자 리스트
    highlightParticipants: [0, 3]               // 강조할 참여자 인덱스 (선택)
  },
  // ...
};

export const PROJECT_ORDER = [
  'crafteam',
  'panorama',
  // ...
];
```
- `PROJECTS`: 프로젝트 카드 및 상세 페이지에 필요한 모든 메타 정보를 보관하는 맵.
- `PROJECT_ORDER`: Projects 페이지 카드 노출 순서를 제어하는 배열.
- `iconDark`·`hoverIconDark`: 다크 모드에 특화된 아이콘이 있을 때만 설정(없으면 `null`).
- `themeMode`: 개별 프로젝트 페이지에서 강제로 적용할 테마가 있을 때 사용 (`'auto'`가 기본값).
- `external`이 `true`일 경우 개별 페이지 대신 외부 링크로 연결.
- `participants`는 `src/Data/personLinks.json`과 연계되어 자동 하이퍼링크 처리됨.
- `highlightParticipants`: 강조할 참여자 인덱스 배열. 미지정 시 `Hyunseung Lim`만 자동 강조.
- `subtitle` 값은 모든 프로젝트에서 필수로 사용 중이며, 상세 페이지에서 제목 바로 아래 표시됩니다.
- `status` 필드는 2025년 9월 26일부로 완전히 제거되었습니다. 필요한 경우 본문에서 직접 설명하세요.

### 4. 주요 페이지 컴포넌트

#### MainPage (`src/Pages/MainPage.js`)
- **무한 이미지 캐러셀** (DIS 2024 컨퍼런스 이미지)
- **페이드인 애니메이션**
- **반응형 디자인**
#### Projects 페이지 (`src/Pages/projects.js`)
- **아이콘 기반 프로젝트 그리드**: Crafteam, StereoHunter, PANORAMA, Feed-O-Meter, AQUA, Datopia, Brownie, Elevate, Aqua Design
- **다크/라이트 전용 아이콘 자동 전환** (`ThemeContext` 상태에 따라 세트 교체)
- **Datopia·Feed-O-Meter·Crafteam·StereoHunter·Elevate·AQUA·Aqua Design·Brownie**: 템플릿 기반 개별 상세 페이지로 이동
- **PANORAMA**: 외부 GitHub 리포지토리로 바로 연결
- **중앙 페이드인 시스템**: `useFadeInAnimation(0.1)`으로 모든 카드 동일 타이밍의 페이드 인 적용
- **호버 자산 제어**: `data-hover` 속성과 공통 핸들러로 정리, 필요 시 다크 모드 전용 아이콘 사용
- **지연 로딩**: 모든 프로젝트 아이콘에 `loading="lazy"` 적용
- **데이터 소스**: `src/Data/projectsMeta.js`의 `PROJECTS` 맵과 `PROJECT_ORDER` 배열을 참조해 아이콘/링크/메타 정보를 일괄 관리
- **참여자 링크 자동 매핑**: `personLinks.json`에 등록된 인물명은 자동으로 외부 사이트 하이퍼링크 제공

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
기존의 JSON 기반 프로젝트 목록에서 개별 페이지 시스템으로 변경:

```
src/Pages/Projects/
├── ProjectTemplate.js       # 재사용 가능한 프로젝트 템플릿
├── ProjectTemplate.css      # 미니멀 디자인 템플릿 스타일
└── [ProjectName]/          # 개별 프로젝트 폴더
    ├── [ProjectName].js    # 프로젝트 페이지 컴포넌트
    └── [ProjectName].css   # (선택) 프로젝트별 커스텀 스타일
```

### 프로젝트 템플릿 기능

#### 1. **배너 이미지 시스템**
- **풀스크린 배너**: 60vh 높이의 반응형 배너 이미지
- **투명한 상단바**: 배너 위에서는 완전 투명, 스크롤 시 원래 배경으로 복원
- **스크롤 감지**: 배너 영역을 지나치면 자동으로 상단바 스타일 전환

### 현재 제공 중인 프로젝트 페이지
- **Datopia** (`/projects/datopia`): 다크 모드 전용 테마로 렌더링, 애니메이션 배경 포함
- **Feed-O-Meter** (`/projects/feed-o-meter`): 템플릿 기반 리서치 소개
- **Crafteam** (`/projects/crafteam`): 협업 워크숍 기록
- **AQUA** (`/projects/aqua`): 설치형 프로젝트 개요
- **PANORAMA**: 프로젝트 그리드에서 GitHub 리포지토리로 바로 이동 (개별 페이지 없음)
- **반응형 높이**: 데스크톱(60vh) → 태블릿(50vh) → 모바일(40vh) → 초소형(35vh)

#### 2. **테마 모드 제어**
- **auto**: 기본값, 사용자의 테마 설정을 따름 (ThemeContext)
- **light**: 항상 라이트 모드로 고정
- **dark**: 항상 다크 모드로 고정
- `ProjectTemplate`이 `ThemeContext`와 직접 연동되어 강제 테마 적용 시 이전 사용자 설정을 안전하게 복원

#### 3. **미니멀 디자인**
- **무채색 팔레트**: 흑백 + 회색조만 사용
- **그림자 효과 제거**: 모든 box-shadow 및 카드 상승 효과 제거
- **간소화된 레이아웃**: Team Members를 년도 아래로 이동, 불필요한 박스 제거
- **타이포그래피**: 가는 폰트 웨이트(300-500), 적절한 레터스페이싱
- **공통 섹션 스타일**: `.project-section`, `.section-title`, `.section-text` 등 기본 레이아웃은 `ProjectTemplate.css`에서 중앙 관리 (필요할 때만 개별 CSS 추가)
- **메타 정보 정렬**: 헤더 메타 블록은 `Period → Project Type` 순으로 고정되며 Status 열은 더 이상 노출되지 않습니다.
- **스크롤 초기화**: 페이지 진입 시 `window.scrollTo(0, 0)`를 호출해 이전 페이지 스크롤 위치가 잔존하는 문제를 방지합니다.

#### 4. **템플릿 Props**
```javascript
<ProjectTemplate
  title="프로젝트 제목"
  year="연도"
  participants={["참여자1", "참여자2", ...]}
  highlightParticipants={[0, 2]}  // 강조할 참여자 인덱스
  bannerImage="/path/to/banner.jpg"  // 선택사항
  themeMode="dark"  // 'auto', 'light', 'dark'
>
  {/* 프로젝트별 커스텀 콘텐츠 */}
</ProjectTemplate>
```

#### 5. **참여자 렌더링**
- `personLinks.json` 매핑으로 등록된 인물명은 자동으로 외부 링크가 부여됨
- `highlightParticipants` 배열이 존재하면 해당 인덱스만 강조, 미지정 시 `Hyunseung Lim`이 기본 강조 대상

### 라우팅 시스템 업데이트
- 기존: `/projects` (전체 프로젝트 목록)
- 추가: `/projects/[project-name]` (개별 프로젝트 페이지)
- 메인 프로젝트 페이지에서 각 프로젝트로 링크 연결

### 현재 구현된 프로젝트
- **Crafteam** (`/projects/crafteam`): 협업 워크숍 기록, `ProjectTemplate` 공통 섹션 활용.
- **StereoHunter** (`/projects/stereohunter`): 인간-LLM 협업 시 고정관념 탐지 워크플로 연구, 바이어스 시각화 실험 요약.
- **PANORAMA**: 그리드에서 GitHub 리포지토리로 직접 이동 (개별 상세 페이지 없음).
- **Feed-O-Meter** (`/projects/feed-o-meter`): 디자인 피드백 역할극 연구, 참여자 링크 자동 매핑.
- **AQUA** (`/projects/aqua`): 설치형 프로젝트 개요, 데이터 스토리텔링 강조.
- **Datopia** (`/projects/datopia`): 다크 모드 전용, 배너 + `dato2.gif` 애니메이션 배경.
- **Brownie** (`/projects/brownie`): AI 베이커리 어시스턴트 콘셉트, 라이트/다크 아이콘 지원.
- **Elevate** (`/projects/elevate`): 대형 워커블 핀 어레이 설치 프로젝트, 기본 템플릿 기반.
- **Aqua Design** (`/projects/aqua-design`): AQUA 확장 버전, 프로젝트 템플릿 재사용.

> 모든 개별 프로젝트 페이지는 `PROJECTS`(src/Data/projectsMeta.js)에서 메타 정보를 가져와 `ProjectTemplate`에 주입합니다.

### FadeIn 애니메이션 시스템 ⭐ 중앙 제어
> **2025-09-25**: fadeIn 애니메이션 시스템 완전 개편 및 중앙 제어 구현

#### 1. **중앙 제어 CSS Variables**
```css
/* src/styles/transitions.css에서 전역 관리 */
:root {
  --animation-transition-speed: 0.6s;  /* fadeIn 속도 */
  --animation-transition-easing: ease-out;  /* fadeIn 이징 */
}
```

#### 2. **중앙 제어 클래스**
```css
.fade-in-element {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity var(--animation-transition-speed) var(--animation-transition-easing),
    transform var(--animation-transition-speed) var(--animation-transition-easing);
}

.fade-in-element:not(.fade-in-active) {
  opacity: 0;
  transform: translateY(24px);
}
```

#### 3. **useFadeInAnimation 사용법**
- `const fadeInRef = useFadeInAnimation();` 형태로 호출 (threshold 기본값 0.1)
- `ref={fadeInRef}`를 원하는 요소에 전달하면 뷰포트 진입 시 자동으로 `.fade-in-active`가 부여됨

#### 4. **페이지별 적용 상태**
- ✅ **Main / About / Projects / Publications / ProjectTemplate**: 전부 `.fade-in-element` 시스템으로 통일
- ✅ `.animation` 기반 레거시는 완전히 제거됨
- ✅ 프로젝트 카드, 퍼블리케이션 텍스트 모두 동일한 fade + 24px slide-up 모션 공유

#### 5. **중앙 제어 애니메이션 사양**
| 항목 | 값 |
|------|----|
| 초기 상태 | opacity 0, translateY(24px) |
| 활성 상태 | opacity 1, translateY(0) |
| 기본 속도 | `--animation-transition-speed` (0.6s ease-out) |

#### 6. **적용 방법 요약**
1. `const fadeInRef = useFadeInAnimation();` 선언
2. `ref={fadeInRef}`만 부여하면 모든 요소가 동일한 타이밍으로 등장

### 애니메이션 시스템 (최신)
- Intersection Observer 기반으로 엔트리 시점에만 class 토글
- 초기 viewport 안에 있는 요소는 두 프레임 지연 후 활성화시켜 부드러운 전환 보장
- 모든 애니메이션 속성은 `src/styles/transitions.css`에서 일괄 관리

### 반응형 설계
- **4단계 브레이크포인트**: 992px, 768px, 480px
- **상단바 겹침 방지**: 배너 없는 프로젝트는 자동 padding-top 적용
- **모바일 최적화**: 배너 높이, 폰트 크기, 여백 조정
- **Aqua Design 특화**: 모바일에서는 텍스트가 먼저, 이미지가 나중에 나오며 이미지 폭을 75%로 줄여 세로 스크롤 가독성을 확보

## 향후 수정 시 주의사항
1. **데이터 추가**: `src/Data/` 폴더의 JSON 파일들 수정 (기존 시스템)
2. **새로운 프로젝트 추가**:
   - `src/Pages/Projects/[ProjectName]/` 폴더 생성
   - 프로젝트 컴포넌트와 스타일 파일 추가
   - `App.js`에 새 라우트 추가
3. **배너 이미지**: `public/images/` 폴더에 추가
4. **테마 설정**: 프로젝트별로 `themeMode` prop으로 테마 강제 설정 가능
5. **스타일 커스터마이징**: 필요한 경우에만 각 프로젝트 폴더에 CSS를 추가 (기본 섹션 스타일은 `ProjectTemplate.css` 제공)
6. **빌드 전 테스트**: `npm start`로 로컬 테스트 후 `npm run deploy`로 배포

## 기술적 특징
- **스크롤 이벤트 최적화**: useEffect를 통한 이벤트 리스너 관리
- **CSS 변수 활용**: 다크/라이트 모드 간 부드러운 전환
- **컴포넌트 재사용성**: ProjectTemplate을 통한 일관된 레이아웃
- **접근성 고려**: 적절한 alt 텍스트, focus state 제공

## 테마 전환 시스템 (Theme Transition System)

### 중앙 제어 시스템
모든 테마 전환 애니메이션은 `src/styles/transitions.css`에서 중앙 관리됩니다:

```css
:root {
  --theme-transition-speed: 0.3s;        /* 테마 색상 전환 */
  --animation-transition-speed: 0.6s;    /* 페이드인/아웃 */
  --hover-transition-speed: 0.2s;        /* 호버 효과 */
  --layout-transition-speed: 0.3s;       /* 레이아웃 변경 */
}
```

### 핵심 설계 원칙
1. **애니메이션과 색상 전환 분리**: `.fade-in-element`로 제어되는 애니메이션과 일반 텍스트 전환을 분리해 충돌 방지
2. **전역 텍스트 요소 적용**: 모든 h1-h6, p, span, div, a, li 등에 자동 적용
3. **!important 우선순위**: 복합 transition에서 색상 전환이 무시되지 않도록 보장
4. **CSS 변수 일관성**: 하드코딩된 값 대신 CSS 변수 사용으로 중앙 제어

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
3. **Subtitle 일관화**: 모든 프로젝트가 `subtitle`을 갖도록 데이터 정비를 완료해, 제목 바로 아래 줄에서 내러티브를 강조합니다.
4. **스크롤 초기화**: 개별 프로젝트 페이지 진입 시 스크롤을 항상 최상단으로 이동시켜, 이전 페이지에서 내려간 상태로 새로운 페이지가 부분만 보이던 레거시 문제를 제거했습니다.
5. **Aqua Design 전면 개편**:
   - `public/projects/aqua-design/thumbnail.png`, `thumbnail_dark.png`, `img1.png` 자산을 추가하고 테마별 배너를 자동 전환.
   - 좌측 이미지(85%) / 우측 본문(60% 비중)의 커스텀 섹션과 굵은 서브타이틀, 강조 텍스트를 도입.
   - Datopia 페이지와 동일한 패턴으로 YouTube 임베드(`https://www.youtube.com/embed/hctUpCzpNfU?si=0as3GUUX7a9Agss-`)를 추가.
   - 모바일에서는 텍스트 → 이미지 순으로 자동 재배치하고 이미지 폭을 75%로 축소해 가독성을 확보.
6. **문서 업데이트**: 본 문서에 최신 구조, 필드 변화, 레이아웃 규칙을 반영해 향후 유지보수시 혼선을 방지했습니다.

---
*최종 업데이트: 2025년 9월 26일*
