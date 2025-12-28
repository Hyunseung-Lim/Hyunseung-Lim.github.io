# 프로젝트 스타일 가이드

최근 CSS 구조를 정리하면서 전역 규칙과 페이지별 작성 원칙을 통합했습니다. 이 문서는 새 섹션이나 프로젝트 추가 시 반드시 지켜야 할 기준을 정리한 것입니다.

## 1. 공통 레이아웃 (`src/styles/project-pages.css`)
- 모든 프로젝트 페이지는 `useProjectPageFrame`을 통해 `.project-page` 클래스를 루트에 부여합니다.
  - 824px 최대 폭, 좌우 패딩, 배너 유무에 따른 상단 여백 등을 전역에서 자동으로 처리합니다.
  - 배너가 있을 때는 Topbar를 투명하게 유지하고, 스크롤 이후 `scrolled-past-banner` 클래스로 배경을 전환합니다.
- 페이드인 시스템:
  - `.project-container .fade-in-element` 규칙을 전역에서 정의해 `opacity: 0 → 1`, `translateY(24px → 0)` 전환을 일괄 제어합니다.
  - 프로젝트별 CSS에서는 이 규칙을 다시 선언하지 말고, 필요한 DOM 요소에 `useFadeInAnimation` ref만 연결합니다.
- `.project-section`, `.section-list` 등 기본 구조는 전역에서 동일한 여백과 라인 높이를 가지므로, 개별 페이지에서 중복 정의할 필요가 없습니다.
- 제목 아래 구분선은 `.project-divider project-divider--header` 요소를 헤더 바로 뒤에 두어 표현합니다. 기본 `.project-header`에서는 보더를 사용하지 않으므로, 모든 프로젝트 페이지는 JSX에서 이 divider를 추가하고 `fadeInRef`를 연결해야 합니다.

### 반응형 브레이크포인트
- `≤992px`: 컨테이너 패딩 `1.5rem`, 배너가 없을 경우 자동으로 상단 여백(`padding-top: 3.5rem`, `margin-top: 2.5rem`) 조정.
- `≤768px`: 패딩 `1rem`, 상단 여백 `3.5rem / 2.25rem`.
- `≤480px`: 상단 여백 `3.1rem / 1.85rem`, 헤더 폰트/메타 텍스트 크기도 자동 축소.

## 2. 타이포그래피
- 기본 본문(`.section-text`):
  - 데스크톱 1rem / line-height 1.65
  - 모바일 0.8rem
- 소형 본문(`.section-text--small`):
  - 데스크톱 0.9rem, 모바일 0.74rem
  - 캡션, 보조 설명, Elevate 애플리케이션 설명 등 기존에 0.9~0.95rem로 쓰이던 텍스트는 이 클래스를 함께 사용하세요.
- 섹션 제목(`.section-title`): 데스크톱 1.65rem / 모바일 1.3rem으로 전역 통일. 특정 프로젝트에서만 다른 크기가 필요하면 `.project-page--{slug} .section-title`처럼 범위를 제한해 오버라이드합니다.
- 프로젝트 제목, 부제, 메타 정보(`.meta-label`, `.meta-value`)는 전부 `project-pages.css`에서 관리합니다.

## 3. 배너 & Topbar
- 배너 높이, 이미지 포지션, 배경 비디오 등 각 페이지 고유 요소만 프로젝트 CSS에 정의하세요.
- Topbar 투명/불투명 전환 로직은 전역 클래스와 `useProjectPageFrame`이 이미 처리하므로 다시 선언할 필요가 없습니다.

## 4. 프로젝트별 체크포인트
- **Aqua**: 개요 문단은 기본 본문 크기, 추가 설명이 필요하면 `section-text--small`을 조합해 사용.
- **Elevate**: 행 내부 및 하단의 애플리케이션 설명 모두 `section-text section-text--small`로 통일.
- **Feed-O-Meter**: 내부 UI 프레임(`.feedometer-*`) 등만 커스터마이즈, 기본 레이아웃/본문/리스트는 전역 규칙 사용.
- **Datopia / Panorama**: 데이터셋 그리드 등 고유 요소만 남기고, 컨테이너/페이드인/본문/리스트는 전역에서 관리.
- **Aqua Design / Brownie / Crafteam / StereoHunter**: 중복 CSS를 제거했으므로 이후 수정 시에도 전역 규칙을 우선 확인하세요.

## 5. 언제 CSS를 추가해야 하는가?
1. **고유 컴포넌트**: Feed-O-Meter UI, Datopia의 카드를 비롯해 특정 페이지만 사용하는 구조는 `.project-page--slug` 접두사를 유지한 채 정의합니다.
2. **본문 크기 변형**: `section-text` + `section-text--small` 조합으로 충분한지 먼저 확인한 뒤, 추가 스타일이 필요한 경우에만 별도의 modifier 클래스를 만듭니다.
3. **배너/히어로**: 높이 조정이나 별도 미디어 처리만 프로젝트 CSS에서 다룹니다.

## 6. 새로운 프로젝트 추가 절차
1. `ProjectTemplate.js`를 복제해 기본 구조(Topbar, 배너, 섹션, Footer)를 유지합니다.
2. 본문 텍스트는 `className="section-text"` 또는 `className="section-text section-text--small"`로 통일합니다.
3. `src/styles/project-pages.css`를 먼저 확인한 뒤, 필요한 배너/커스텀 컴포넌트만 해당 프로젝트 CSS에 작성합니다.
4. 반응형 조정이 추가로 필요하다면 `.project-page--slug` 범위에 한정된 미디어 쿼리만 사용합니다.

## 7. FadeIn 시스템 요약
1. `const fadeInRef = useFadeInAnimation({ root: scrollRoot });`
2. 실제 DOM 요소에 `ref={fadeInRef}`를 전달
3. `.fade-in-element` 초기 상태(`opacity:0`, `translateY(24px)`)는 전역 CSS에서 자동 적용
4. Intersection Observer 기반으로 뷰포트 진입 시 `.fade-in-active`를 붙여 애니메이션을 실행

## 8. 테마 전환 / 애니메이션 전역 변수
- `src/styles/transitions.css`에서 다음 변수를 관리합니다.
  - `--theme-transition-speed`: 색상·배경 전환 속도 (0.3s)
  - `--animation-transition-speed`: 페이드인 속도 (0.6s)
  - `--hover-transition-speed`, `--layout-transition-speed` 등은 공통 인터랙션 효과에 사용
- 텍스트, 배경, 보더 전환은 `theme-transition` 계열 클래스로 일괄 관리하며, 페이드인 트랜지션과 충돌하지 않도록 애니메이션과 색상 전환을 분리합니다.
- 전역 텍스트 요소(h1~h6, p, span 등)에는 컬러 전환이 자동으로 적용되며, 하드코딩 대신 CSS 변수를 사용해 일관성을 유지합니다.

전역 규칙을 준수하면 모든 프로젝트 페이지가 동일한 리듬과 타이포그래피를 유지합니다. 새로운 스타일을 추가하거나 기존 페이지를 수정할 때는 반드시 이 문서를 확인하고, 동일한 기능을 전역에서 이미 제공하지 않는지 먼저 검토하세요.***
