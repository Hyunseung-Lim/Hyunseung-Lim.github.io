# Fade-in 가이드

## 1. 기본 훅 사용법
- `useFadeInAnimation`을 컴포넌트당 **한 번만** 호출합니다. 추가 fade ref를 만들지 마세요.
- 실제 DOM 요소(h1, p, ul, img 등)에 `ref={fadeInRef}`를 직접 부여합니다.
- 여러 요소에 같은 ref를 재사용해도 괜찮습니다.
- 커스텀 React 컴포넌트(예: `Link`, `Button` 래퍼)에는 ref를 바로 전달하지 않으므로, 반드시 `<div>`, `<section>`, `<a>` 같은 실 DOM 래퍼를 만들어 ref를 걸어주세요.
- 스크롤 컨테이너가 따로 있으면 `const fadeInRef = useFadeInAnimation({ threshold: 0.1, root: scrollEl });`처럼 `root` 옵션을 넘겨주세요. `root`는 state/callback ref 등으로 DOM 엘리먼트를 전달해야 하며, 단순 ref 객체(`useRef`)를 그대로 넘기면 리렌더가 일어나지 않아 동작하지 않습니다.
- 개별 프로젝트 페이지처럼 `.project-container`가 별도의 스크롤 컨테이너 역할을 한다면, Datopia/Aqua Design 사례처럼 `ref={setScrollRoot}`로 컨테이너 DOM을 저장한 뒤 `useFadeInAnimation({ root: scrollRoot })`로 넘겨야 요소가 화면에 들어왔을 때마다 순차적으로 페이드인됩니다. 루트를 지정하지 않으면 윈도우 기준으로 즉시 활성화될 수 있습니다.

## 2. CSS 조건
- `.fade-in-element` 상태에서 `opacity:0`, `transform: translateY(...)`가 적용되어야 합니다.
- `.project-container *`처럼 광범위한 transition 규칙이 `opacity/transform`을 덮어쓰지 않도록 주의합니다.
- 섹션 전체를 페이드하고 싶다면 `<section>` 내부에 `div.inner` 같은 래퍼를 만들어 그 래퍼에 ref를 부여합니다.

## 3. 자주 발생하는 문제 & 체크
1. 부모/자식 중복 ref → 실제 애니메이션 요소에만 ref 부여.
2. 초기 뷰포트 안에서 시작 → 자식 요소에 ref 부여하거나 한 프레임 지연.
3. CSS override → opacity/transform을 고정하는 규칙 제거.
4. 프래그먼트 ref → 실제 DOM 요소인지 확인.
5. 접근성 Reduce Motion → 테스트 시 꺼두기.
6. **초기 스크롤/레이아웃 제어** → `window.scrollTo`나 강제 레이아웃 조정이 발생하면 훅의 fallback이 즉시 실행될 수 있으므로, 각 요소가 최소 한 프레임 동안 `fade-in-element` 상태를 유지하도록 `requestAnimationFrame`(또는 동일한 딜레이)을 보장해야 합니다.
7. **컴포넌트 ref 전달 여부** → ref가 실제 DOM까지 전달되지 않으면 Intersection Observer에 등록되지 않습니다. 버튼/링크 컴포넌트를 감싸는 래퍼(div 등)를 만들어 해당 래퍼에 ref를 부여하세요.

## 4. 디버그 절차
- DevTools Elements에서 `.fade-in-element`와 `.fade-in-active` 토글 확인.
- 이벤트 트리거가 없다면 위 체크리스트를 순차적으로 적용.

## 5. 적용 예시
- Publications: `year`, `info`, `title`, `authors` 각각 ref 적용.
- Projects: 헤더 텍스트, 메타, 본문 섹션/이미지에 동일 ref 재사용.

## 6. 현재 적용 상태 체크리스트
- ✅ 정상: `MainPage.js`, `publications.js`, `projects.js`(프로젝트 타일 전부 컨테이너 스크롤 대응)
- ⚠️ 개별 프로젝트 상세 페이지는 동일 패턴 유지 중(프로젝트별 콘텐츠만 상이).

## 7. Issue Report
- 2025-12-17: Aqua Design 이미지/비디오가 fade-in을 거치지 않음 → `useFadeInAnimation`의 `isInView` 분기에서 observer 등록을 누락함이 문제. 해당 분기를 수정해 항상 observe하도록 조정.
- 2025-12-17: Aqua Design subtitle/본문 텍스트가 보이지 않음 → 텍스트 컨테이너가 `opacity:0`로 고정되어 있었음. 실제 텍스트 요소에만 fade-in transition을 적용하도록 CSS 분리.
- 2025-12-18: Aqua Design 헤더 메타/서브타이틀에 애니메이션 미적용 → `scrollTo(0,0)` 시점에 fallback이 즉시 실행돼 `.fade-in-element` 상태를 건너뛰는 것이 원인. `useFadeInAnimation`에 초기 프레임 가드 + 공용 지연을 도입하고, 헤더 요소도 전용 래퍼 클래스로 감싸 동일한 fade 블록으로 통일.
- 2025-12-20: Projects 페이지 하단 타일이 활성화되지 않음 → `.project-tiles` 컨테이너가 독립적으로 스크롤되는 구조인데 훅이 `window`만 관찰하고 있어 발생. `useFadeInAnimation`에 `root` 옵션을 추가하고 Projects 컴포넌트에서 callback ref로 DOM을 state에 저장해 전달하도록 변경, 컨테이너 스크롤 시에도 IntersectionObserver/fallback이 정상 동작하도록 최종 정리. Legacy observer map/루트 추적 로직을 제거해 코드 경량화.
