# PRD-Roadmap-Architect 에이전트 메모리

## 프로젝트 컨텍스트

- **프로젝트**: notion-cms-project (개인 포트폴리오, Notion CMS 기반)
- **스택**: Next.js 16, React 19, TypeScript, TailwindCSS v4, shadcn/ui, @notionhq/client v5
- **로드맵 문서**: `/Users/jeongsol/workspace/notion-cms-project/ROADMAP.md` (2026-03-05 생성)
- **PRD 문서**: `/Users/jeongsol/workspace/notion-cms-project/docs/PRD.md`

## 구현 현황 스냅샷 (2026-03-05)

### 완료된 핵심 구현
- Notion API 클라이언트/쿼리/파서: `lib/notion/` 전체
- TypeScript 타입 정의: `types/notion.ts`
- 포트폴리오 목록/상세 페이지: `app/portfolio/page.tsx`, `app/portfolio/[id]/page.tsx`
- API 라우트: `app/api/projects/route.ts`, `app/api/projects/[id]/route.ts`
- Portfolio 컴포넌트: `project-card`, `portfolio-filters`, `portfolio-list`, `notion-renderer`

### 미완료 (ROADMAP Phase 1-3 작업)
- 환경 변수 설정 (.env.local)
- next.config.ts 이미지 도메인
- 홈 페이지 Featured 프로젝트 섹션
- 다크모드 Navbar 연동
- SEO 최적화 (sitemap.ts, robots.ts)
- 에러 페이지 (not-found.tsx, error.tsx)
- About 페이지
- Vercel 배포

## 중요 기술 패턴

### Notion API v5 변경사항
- `databases.query()` → `dataSources.query(data_source_id: ...)` 으로 변경됨
- `lib/notion/queries.ts`에 이미 반영됨

### ISR 설정
- 모든 동적 페이지에 `export const revalidate = 60` 적용
- API 라우트에 `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` 헤더 적용

### 검색 구현 방식
- Notion API는 텍스트 검색 미지원 → 클라이언트 사이드 필터링
- 대량 데이터(100개+)에서 성능 이슈 발생 가능 - 향후 개선 필요

### 이미지 처리
- Notion 내부 파일 URL: 약 1시간 후 만료
- ISR 60초로 대부분 커버, but 엣지 캐시에서 만료 이미지 깨짐 가능
- `parser.ts`의 `extractCoverUrl()` + `extractFileUrl()` 으로 처리

## 로드맵 생성 패턴

### 현황 분석 우선
- PRD 분석과 함께 기존 구현 파일 반드시 확인 (Glob + Read 병렬 실행)
- 이미 구현된 것과 미구현된 것을 명확히 구분하여 로드맵에 반영

### 5-Phase 구조 원칙 (2026-03-05 사용자 요청 기반)
- Phase 1: 프로젝트 초기 설정 (골격) - 환경 변수, 이미지 도메인, 라우팅 확인, 타입 정의
- Phase 2: 공통 모듈 개발 - API 클라이언트 안정화, 데이터 검증, React Query 훅
- Phase 3: 핵심 기능 개발 - 목록/상세 페이지, 필터/검색, 에러 페이지, 페이지네이션
- Phase 4: 추가 기능 개발 - Featured 섹션, SEO, 다크모드, 반응형 완성
- Phase 5: 최적화 및 배포 - 성능 최적화, Vercel 배포, 모니터링

### 수락 기준 작성 원칙
- 체크박스 형식으로 측정 가능하게 작성
- 기술적 세부사항보다 사용자 관점에서 검증 가능한 조건 명시
- 이미 구현된 부분은 "검토" 또는 "(이미 구현됨)" 표기

### 신규 파일 위치 패턴 (ROADMAP 2차 버전)
- React Query 훅: `hooks/use-projects.ts`, `hooks/use-project.ts`, `hooks/index.ts`
- "더 보기" 버튼: `components/portfolio/load-more-button.tsx`
- Featured 섹션: `components/sections/featured-projects.tsx`
- SEO: `app/sitemap.ts`, `app/robots.ts`
- 에러 페이지: `app/not-found.tsx`, `app/error.tsx`, `app/portfolio/error.tsx`

## 상세 패턴 문서
- `patterns.md` 참조 (로드맵 아키텍처 패턴 상세)
