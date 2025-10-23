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
│   └── images/               # 이미지 파일들
│       └── banner/           # 배너 이미지들
│           └── dis2024/      # DIS 2024 컨퍼런스 배너 이미지들
├── src/                      # 소스 코드
│   ├── Components/           # 재사용 가능한 컴포넌트들
│   │   ├── Footer/          # 푸터 컴포넌트
│   │   ├── SegmentedButton/ # 세그먼트 버튼 컴포넌트
│   │   ├── ThemeToggle/     # 테마 토글 컴포넌트
│   │   └── Topbar/          # 상단 네비게이션 바
│   ├── Data/                # 데이터 파일들
│   │   ├── publications.json # 논문 데이터
│   │   └── projects.json    # 프로젝트 데이터
│   ├── Pages/               # 페이지 컴포넌트들
│   │   ├── MainPage.js      # 메인 페이지
│   │   ├── ProjectsPage.js  # 프로젝트 페이지
│   │   ├── ResearchPage.js  # 연구 페이지
│   │   └── publications.js  # 논문 목록 페이지
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

### 1. 라우팅 구조 (`src/App.js:10-25`)
```javascript
<Routes>
  <Route path='/' element={<MainPage/>} />
  <Route path='/research' element={<ResearchPage/>} />
  <Route path='/projects' element={<ProjectsPage/>} />
  <Route path='/publications' element={<Publications/>} />
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

#### 프로젝트 데이터 (`src/Data/projects.json`)
```json
{
  "title": "프로젝트 제목",
  "people": ["참여자 목록"],
  "highlight_people": [강조할_참여자_인덱스],
  "year": "연도",
  "description": "프로젝트 설명",
  "image": "이미지 파일명"
}
```

### 4. 주요 페이지 컴포넌트

#### MainPage (`src/Pages/MainPage.js`)
- **무한 이미지 캐러셀** (DIS 2024 컨퍼런스 이미지)
- **페이드인 애니메이션**
- **반응형 디자인**

#### Publications 페이지 (`src/Pages/publications.js`)
- **다중 필터링 시스템**:
  - 분야별 필터 (HAI, LLM, Creativity, Learning, AI Ethics, Others)
  - 타입별 필터 (First Author, Conference, Journal, Poster, Workshop, Preprint)
- **연도별 그룹핑**
- **인터섹션 옵저버를 통한 스크롤 애니메이션**
- **반응형 세그먼트 컨트롤**

### 5. 커스텀 훅들

#### `useInfiniteCarousel` (`src/hooks/useInfiniteCarousel.js`)
- 무한 스크롤 이미지 캐러셀 구현
- 자동 슬라이드 기능
- 부드러운 전환 효과

#### `useFadeInAnimation` (`src/hooks/useFadeInAnimation.js`)
- 요소가 뷰포트에 들어올 때 페이드인 효과
- 재사용 가능한 애니메이션 훅

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
    └── [ProjectName].css   # 프로젝트별 커스텀 스타일
```

### 프로젝트 템플릿 기능

#### 1. **배너 이미지 시스템**
- **풀스크린 배너**: 60vh 높이의 반응형 배너 이미지
- **투명한 상단바**: 배너 위에서는 완전 투명, 스크롤 시 원래 배경으로 복원
- **스크롤 감지**: 배너 영역을 지나치면 자동으로 상단바 스타일 전환
- **반응형 높이**: 데스크톱(60vh) → 태블릿(50vh) → 모바일(40vh) → 초소형(35vh)

#### 2. **테마 모드 제어**
- **auto**: 기본값, 사용자의 테마 설정을 따름 (ThemeContext)
- **light**: 항상 라이트 모드로 고정
- **dark**: 항상 다크 모드로 고정

#### 3. **미니멀 디자인**
- **무채색 팔레트**: 흑백 + 회색조만 사용
- **그림자 효과 제거**: 모든 box-shadow 및 카드 상승 효과 제거
- **간소화된 레이아웃**: Team Members를 년도 아래로 이동, 불필요한 박스 제거
- **타이포그래피**: 가는 폰트 웨이트(300-500), 적절한 레터스페이싱

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

### 라우팅 시스템 업데이트
- 기존: `/projects` (전체 프로젝트 목록)
- 추가: `/projects/[project-name]` (개별 프로젝트 페이지)
- 메인 프로젝트 페이지에서 각 프로젝트로 링크 연결

### 현재 구현된 프로젝트
1. **Datopia** (`/projects/datopia`)
   - 다크 모드 전용 (`themeMode="dark"`)
   - 배너 이미지 포함
   - 페이지 진입 시 테마 컨텍스트를 강제로 다크 모드로 설정 (퇴장 시 이전 테마 복귀)
   - 프로젝트 설명과 별도로 `dato2.gif`를 화면 하단에 고정해 반복 재생
   - 전시 소개 영상(YouTube) 임베드와 전시 이미지 2종(데스크탑 가로/모바일 세로, 동일 높이 가변 프레임) (`src/Pages/Projects/Datopia/Datopia.js`, `Datopia.css`)
   - 영상·이미지 사이 분리선과 wavy underline 강조 텍스트 추가
   - 1→2→3개 순환으로 이미지를 이어 붙여 이동시킴 (`src/Pages/Projects/Datopia/Datopia.js`, `Datopia.css`)
   - 각 이미지 높이는 뷰포트 25% 이하로 제한되어 다양한 화면 비율 대응

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

#### 2. **새로운 클래스 시스템**
```css
/* 새로운 중앙 제어 fadeIn 시스템 */
.fade-in-element {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity var(--animation-transition-speed),
              transform var(--animation-transition-speed);
}

.fade-in-element.fade-in-active {
  opacity: 1;
  transform: translateY(0);
}

/* 지연 효과 클래스 */
.delay-1 { transition-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; }
```

#### 3. **업데이트된 useFadeInAnimation Hook**
```javascript
// 중앙 제어 시스템 사용법
const fadeInRef = useFadeInAnimation(0.1, true); // 새 시스템
const fadeInRef = useFadeInAnimation(); // 레거시 시스템 (호환성)
```

#### 4. **페이지별 적용 상태**
- ✅ **Publications**: 레거시 시스템 최적화 완료 (`.animation` 클래스 사용)
- 🔄 **Projects**: 레거시 시스템 유지 (향후 마이그레이션 필요)
- 🔄 **About**: 레거시 시스템 유지 (향후 마이그레이션 필요)
- 🔄 **ProjectTemplate**: 레거시 시스템 유지 (향후 마이그레이션 필요)

#### 5. **레거시 시스템과의 차이점**
| 구분 | 레거시 | 새 시스템 |
|------|--------|----------|
| 클래스명 | `.animation` | `.fade-in-active` |
| 초기 상태 | 각 페이지 CSS 정의 | `.fade-in-element` |
| 속도 제어 | 하드코딩 | CSS 변수 중앙 제어 |
| 호환성 | 기존 페이지 | 점진적 마이그레이션 |

#### 6. **최적화된 레거시 시스템 (현재 적용)**
> **2025-09-25**: Publications 페이지 레거시 시스템 최적화 완료

**현재 구조:**
```css
/* 통합된 초기 상태 */
.publications .year,
.publications .info,
.publications .title,
.publications .authors,
.publications .awards,
.publications .venue-links {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity, transform, color;
  color: var(--text-primary);
}

/* 애니메이션 활성화 */
.publications .year.animation,
.publications .info.animation,
/* ... */ {
  opacity: 1;
  transform: translateY(0);
}
```

**최적화 사항:**
- CSS 규칙 통합으로 코드 중복 제거
- 색상 전환과 fadeIn 애니메이션 충돌 해결
- Hook 로직 단순화 (`classList.toggle` 사용)
- 메모리 누수 방지 (`observer.unobserve` 추가)

#### 7. **향후 마이그레이션 가이드**
1. `useFadeInAnimation(0.1, true)` 두 번째 파라미터에 `true` 추가
2. 기존 개별 CSS 애니메이션 정의 제거
3. `ref={fadeInRef}` 적용으로 자동 `.fade-in-element` 클래스 할당
4. 필요시 `delay-1`, `delay-2`, `delay-3` 클래스 추가

### 애니메이션 시스템 (레거시)
- **진입 애니메이션**: fadeInUp, slideDown, fadeInLeft, fadeInRight
- **부드러운 전환**: 20px 이동 + opacity 변화 (기존 30px에서 축소)
- **스크롤 기반**: 배너에서 콘텐츠로 전환 시 부드러운 애니메이션

### 반응형 설계
- **4단계 브레이크포인트**: 992px, 768px, 480px
- **상단바 겹침 방지**: 배너 없는 프로젝트는 자동 padding-top 적용
- **모바일 최적화**: 배너 높이, 폰트 크기, 여백 조정

## 향후 수정 시 주의사항
1. **데이터 추가**: `src/Data/` 폴더의 JSON 파일들 수정 (기존 시스템)
2. **새로운 프로젝트 추가**:
   - `src/Pages/Projects/[ProjectName]/` 폴더 생성
   - 프로젝트 컴포넌트와 스타일 파일 추가
   - `App.js`에 새 라우트 추가
3. **배너 이미지**: `public/images/` 폴더에 추가
4. **테마 설정**: 프로젝트별로 `themeMode` prop으로 테마 강제 설정 가능
5. **스타일 커스터마이징**: 각 프로젝트 폴더의 CSS 파일에서 개별 스타일 적용
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
1. **애니메이션과 색상 전환 분리**: `.animation` 클래스가 있는 요소들의 색상 전환을 별도 처리
2. **전역 텍스트 요소 적용**: 모든 h1-h6, p, span, div, a, li 등에 자동 적용
3. **!important 우선순위**: 복합 transition에서 색상 전환이 무시되지 않도록 보장
4. **CSS 변수 일관성**: 하드코딩된 값 대신 CSS 변수 사용으로 중앙 제어

### 문제 해결 히스토리
- **Publication 페이지 딜레이**: Intersection Observer와 `.animation` 클래스로 인한 전환 지연 해결
- **Venue-text 문제**: 하드코딩된 색상값에서 CSS 변수 시스템으로 전환
- **복합 Transition 간섭**: opacity/transform 애니메이션과 색상 전환 분리로 해결
- **방향별 전환 차이**: 라이트→다크, 다크→라이트 양방향 동일한 transition 보장

### 유지보수 가이드
- **전환 속도 변경**: `--theme-transition-speed` 변수 하나만 수정
- **새로운 컴포넌트**: CSS 변수 사용시 자동으로 일관된 전환 적용
- **디버깅**: 2초 느린 전환(`transition: all 2s ease`)으로 테스트 가능

---
*최종 업데이트: 2025년 9월 25일*
