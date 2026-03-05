# Code Reviewer Agent Memory

## 프로젝트 개요
Next.js 16 + React 19 모던 웹 스타터킷. 첫 번째 리뷰: 2026-03-03.

## 확인된 주요 패턴

### 잘 구현된 패턴
- next-themes: suppressHydrationWarning + mounted 상태 체크로 하이드레이션 안전성 확보
- QueryProvider: useState(() => new QueryClient()) 패턴으로 SSR 안전한 인스턴스 생성
- 배럴 익스포트: 모든 폴더에 index.ts 적절히 구성
- Props 인터페이스: 모든 주요 컴포넌트에 export된 인터페이스 정의
- shadcn/ui: data-slot 속성 활용, Radix UI 기반 접근성 내재화
- TailwindCSS v4: CSS 변수를 @theme inline으로 연결, oklch 색상 사용

### 발견된 문제 패턴
- Footer에서 link.href를 key로 사용 → 동일한 href(#)가 여러 개라 key 중복 위험
- Cta 섹션의 설명 텍스트에 text-primary-foreground/80 사용 → 라이트 모드에서 가독성 문제 (primary-foreground는 거의 흰색)
- page.tsx의 Navbar, Footer 분리 import → 같은 배럴에서 한 번에 import 가능
- navbar.tsx: NavigationMenuLink에 직접 인라인 className 주입 (길고 복잡한 클래스) → navigationMenuTriggerStyle() 헬퍼 미활용
- 모바일 Sheet 내 버튼(로그인/시작하기)의 onClick 핸들러 부재 → 실제 동작 없음 (스타터킷 특성상 허용)
- react-hook-form, zustand, date-fns 등 devDependencies에 있는 런타임 패키지들 → 프로덕션 빌드 영향 없지만 분류 오류

### 접근성 주의 사항
- DropdownMenuItem에 onClick만 있고 aria 속성 없음 (Radix UI가 role="menuitem" 자동 부여하므로 OK)
- Sheet 닫기 버튼의 sr-only 텍스트 "Close" (영어) → 한국어 프로젝트이므로 "닫기"로 변경 권장
- Footer 링크에 aria-label 없음 (텍스트가 있으므로 필수는 아님)

## tsconfig 확인사항
- strict: true 활성화됨 (좋음)
- 경로 별칭: @/* -> ./* 설정됨

## 의존성 분류 문제
런타임 패키지가 devDependencies에 잘못 분류됨:
- @hookform/resolvers
- @tanstack/react-query
- @tanstack/react-query-devtools (이건 dev가 맞음)
- date-fns
- next-themes
- react-hook-form
- zustand

자세한 내용: patterns.md 참조
