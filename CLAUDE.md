# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 + React 19 모던 웹 스타터킷. TypeScript, TailwindCSS v4, shadcn/ui 기반의 프로덕션 준비 완료 프로젝트입니다.

## Development Commands

```bash
# 개발 서버 실행 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start

# ESLint 실행 (설정만 있고 규칙 없음)
npm run lint
```

## Project Architecture

### 주요 폴더 구조

```
app/
├── layout.tsx          # Root layout (Providers, Toaster, TooltipProvider 포함)
├── page.tsx            # 홈페이지 (Navbar + Hero + Features + Cta + Footer)
└── globals.css         # 전역 스타일 + CSS 변수 + 다크모드 설정

components/
├── ui/                 # shadcn 컴포넌트 (button, card, badge, sheet, tooltip, etc.)
├── providers/
│   ├── theme-provider.tsx      # next-themes 래퍼 (SSR 안전)
│   ├── query-provider.tsx      # React Query 설정 (staleTime: 60s)
│   ├── theme-toggle.tsx        # 라이트/다크/시스템 모드 전환
│   └── providers.tsx           # 통합 프로바이더 (theme + query + toast)
├── layout/
│   ├── navbar.tsx              # 반응형 헤더 (모바일: Sheet 드로어)
│   └── footer.tsx              # 동적 링크 그룹
└── sections/
    ├── hero.tsx                # 배지 + 제목 + CTA 버튼
    ├── features.tsx            # 6개 카드 그리드
    └── cta.tsx                 # 강조 섹션
```

### 핵심 스택

**UI 레이어:**
- `next-themes`: SSR 안전한 다크모드 관리 (attribute="class", defaultTheme="system")
- `shadcn/ui` + `@radix-ui`: 접근성 좋은 컴포넌트
- `TailwindCSS v4`: 유틸리티 CSS
- `lucide-react`: 아이콘 라이브러리
- `class-variance-authority` + `clsx` + `tailwind-merge`: 스타일 유틸리티

**상태 관리:**
- `zustand`: 전역 상태 관리
- `@tanstack/react-query`: 서버 상태 캐싱 (devtools 포함)

**폼 & 알림:**
- `react-hook-form` + `@hookform/resolvers`: 폼 관리 및 검증
- `sonner`: 토스트 알림 (리치 컬러, 우상단 위치)
- `date-fns`: 날짜 유틸

### 스타일 시스템

**CSS 변수 (globals.css):**
- `--background`, `--foreground`: 텍스트/배경
- `--primary`, `--primary-foreground`: 주요 색상
- `--secondary`, `--muted`, `--destructive`: 추가 색상
- 다크 모드: `@custom-variant dark` + 미디어 쿼리 대체

**반응형 디자인:**
- Navbar: desktop (NavigationMenu) / mobile (Sheet 드로어)
- Features: `sm:grid-cols-2`, `lg:grid-cols-3`
- 전체 섹션: `container mx-auto px-4`

### 타입 안전성

모든 주요 컴포넌트는 Props 인터페이스 정의:
- `NavItem[]`: navbar 항목
- `FooterLinkGroup[]`: footer 링크 그룹
- `FeaturesProps`, `HeroProps`: 섹션 커스터마이징

## 주의사항

1. **next-themes 초기화**: `suppressHydrationWarning`은 `<html>` 태그에 필수
2. **배럴 익스포트**: `components/providers/index.ts`, `components/layout/index.ts` 등으로 import 간소화
3. **미구현 링크**: footer 및 navbar의 일부 링크는 `#`으로 설정 (차후 페이지 구현 후 수정)
4. **ESLint**: 설정만 있고 규칙이 최소화되어 있음 (필요시 `.eslintrc.json` 확장)

## 배포 준비

- 메타데이터: `title.template` 패턴 사용
- 언어: `lang="ko"` (한국어)
- OpenGraph: `og:locale="ko_KR"` 설정
- Font: Geist (Next.js 기본 폰트)

## 향후 확장

- **인증**: `providers.tsx`에 AuthProvider 추가
- **API 라우트**: `app/api/` 디렉토리에서 구현
- **데이터베이스**: Prisma 등 ORM 추가
- **배포**: Vercel 또는 자체 서버에 배포
