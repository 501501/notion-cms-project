# 프로젝트 코딩 패턴 상세 기록

## shadcn/ui 사용 패턴
- shadcn v3 사용: `radix-ui` 패키지를 통합 임포트 (기존 `@radix-ui/*` 분산 패키지와 다름)
- data-slot 속성을 모든 컴포넌트에 부여 → CSS 선택자로 활용 가능
- cn() 유틸리티: clsx + tailwind-merge 조합

## 다크모드 구현 방식
- next-themes: attribute="class" → html 태그에 .dark 클래스 추가
- globals.css: @custom-variant dark (&:is(.dark *)) → TailwindCSS v4 방식
- ThemeToggle: mounted 체크 패턴 (하이드레이션 불일치 방지)
- oklch 색상 체계 사용 (TailwindCSS v4 기본)

## 컴포넌트 Props 패턴
- 모든 커스터마이징 가능 Props는 export 인터페이스로 정의
- defaultProps 대신 함수 파라미터 기본값 사용 (React 19 권장)
- 섹션 컴포넌트: title, description은 string?, items는 배열? 옵셔널로 정의

## 임포트 순서 (확인된 스타일)
1. React/Next.js 코어
2. 외부 라이브러리 (lucide-react, next-themes 등)
3. 내부 컴포넌트 (@/components/*)
4. 타입 임포트 (import type)

## 반응형 레이아웃 패턴
- container mx-auto max-w-7xl px-4 : 공통 컨테이너 패턴
- 모바일 퍼스트: 기본 스타일 → sm:, md:, lg: 순서
- Navbar: hidden md:block (데스크탑 nav), md:hidden (모바일 버튼)

## 자주 발생하는 실수
1. list key에 중복 가능한 값(href="#") 사용
2. 런타임 패키지를 devDependencies에 배치
3. sheet 닫기 텍스트 영어("Close") 사용 → 한국어 프로젝트 불일치
4. NavigationMenuLink에 navigationMenuTriggerStyle() 미활용 시 인라인 클래스 복잡해짐
