# Notion CMS Project

Next.js 16 + React 19 기반의 모던 웹 스타터킷입니다. TypeScript, TailwindCSS v4, shadcn/ui로 프로덕션 준비가 완료된 프로젝트입니다.

## 🎯 프로젝트 소개

- **프레임워크**: Next.js 16, React 19
- **스타일링**: TailwindCSS v4, shadcn/ui
- **언어**: TypeScript
- **상태 관리**: Zustand, React Query
- **폼 관리**: react-hook-form
- **UI 컴포넌트**: Radix UI 기반 shadcn/ui
- **다크모드**: next-themes (SSR 안전)
- **알림**: Sonner 토스트

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
http://localhost:3000 에서 애플리케이션을 확인할 수 있습니다.

### 프로덕션 빌드
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📁 프로젝트 구조

```
app/
├── layout.tsx          # Root layout (Providers, Toaster, TooltipProvider)
├── page.tsx            # 홈페이지 (Navbar + Hero + Features + CTA + Footer)
└── globals.css         # 전역 스타일 및 CSS 변수

components/
├── ui/                 # shadcn/ui 컴포넌트
├── providers/          # 앱 제공자 (Theme, Query, Toast)
├── layout/             # 레이아웃 컴포넌트 (Navbar, Footer)
└── sections/           # 페이지 섹션 (Hero, Features, CTA)
```

## 🎨 핵심 기능

### 반응형 디자인
- Desktop: NavigationMenu 기반 네비게이션
- Mobile: Sheet 드로어 네비게이션
- Tailwind breakpoints (sm, md, lg, xl)

### 다크모드
- next-themes 기반 SSR 안전한 다크모드
- 라이트, 다크, 시스템 모드 지원
- CSS 변수를 통한 테마 커스터마이징

### 상태 관리
- Zustand: 전역 상태
- React Query: 서버 상태 캐싱 (staleTime: 60s)

### 접근성
- Radix UI 기반 ARIA 준수
- 키보드 네비게이션 지원

## 📦 설치된 패키지

### 프로덕션 의존성
- `next`: 16.1.6
- `react`, `react-dom`: 19.2.3
- `tailwindcss`: 4.x
- `lucide-react`: 아이콘 라이브러리
- `zustand`: 상태 관리

### 개발 의존성
- `typescript`: 5.x
- `react-hook-form`: 폼 관리
- `@tanstack/react-query`: 데이터 페칭
- `sonner`: 토스트 알림
- `next-themes`: 다크모드 관리

## 🔧 개발 팁

### 새 페이지 추가
1. `app/` 디렉토리에 새 폴더 생성
2. `page.tsx` 파일 추가
3. 필요한 컴포넌트 임포트

### 새 컴포넌트 추가
1. `components/` 디렉토리에 파일 생성
2. Props 인터페이스 정의
3. 다른 컴포넌트에서 임포트하여 사용

### UI 컴포넌트 추가
shadcn/ui 컴포넌트는 `shadcn` 명령으로 추가할 수 있습니다:
```bash
npx shadcn-ui@latest add [component-name]
```

## 📝 라이센스

MIT

## 🤝 기여

이 프로젝트에 기여하고 싶다면 Pull Request를 보내주세요!
