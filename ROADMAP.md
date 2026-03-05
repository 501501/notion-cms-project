# 개발 로드맵

**프로젝트**: 개인 포트폴리오 사이트 (Notion CMS 기반)
**총 예상 기간**: 5주 (2026-03-05 ~ 2026-04-09)
**문서 기준일**: 2026-03-05
**참조 문서**: [docs/PRD.md](./docs/PRD.md)

---

## 프로젝트 개요

Notion을 CMS로 활용하는 개인 포트폴리오 웹사이트. Notion 데이터베이스에서 프로젝트 정보를 관리하고, Next.js ISR(증분 정적 재생성)로 60초 이내 자동 반영하는 구조.

**핵심 가치**:
- Notion에서 콘텐츠를 수정하면 웹사이트에 자동 반영 (코드 배포 불필요)
- 현대적 반응형 UI로 채용 담당자 대상 전문성 강화
- shadcn/ui 기반 일관된 디자인 시스템

**우선순위**:
1. P0: 환경 설정 + Notion 연동 + 핵심 라우팅 + 타입 정의
2. P0: Notion API 클라이언트 래퍼 + 데이터 파싱 + API 레이어
3. P0: 프로젝트 목록 + 상세 페이지 + 필터링 + 검색
4. P1: 홈 Featured 섹션 + SEO 최적화 + 반응형 완성
5. P2: 성능 최적화 + 배포 + 모니터링

---

## 현재 구현 현황 (2026-03-05 기준)

프로젝트 초기 설정이 완료되어 있으며, 핵심 기능의 뼈대가 이미 구현된 상태.
아래 로드맵은 **미구현 작업에 집중**하며, 완료된 항목은 검증/통합 단계에서 확인한다.

### 이미 완료된 구현 (코드 존재)

| 파일 경로 | 구현 내용 |
|-----------|-----------|
| `lib/notion/client.ts` | Notion 클라이언트 싱글톤, 환경 변수 검증 |
| `lib/notion/queries.ts` | `getProjects()`, `getProjectById()`, `getFeaturedProjects()`, `getAllProjectIds()` |
| `lib/notion/parser.ts` | `parseProjectPage()`, `parseBlock()`, `extractCoverUrl()`, `extractFileUrl()` |
| `lib/notion/index.ts` | 배럴 익스포트 |
| `types/notion.ts` | `Project`, `ProjectSummary`, `NotionBlock`, `PaginatedProjects` 등 전체 타입 |
| `app/portfolio/page.tsx` | 포트폴리오 목록 페이지 (ISR, Suspense 적용) |
| `app/portfolio/[id]/page.tsx` | 프로젝트 상세 페이지 (generateMetadata, generateStaticParams 포함) |
| `app/api/projects/route.ts` | `GET /api/projects` (필터, 검색, 페이지네이션, 캐시 헤더) |
| `app/api/projects/[id]/route.ts` | `GET /api/projects/[id]` |
| `components/portfolio/project-card.tsx` | 프로젝트 카드 (호버 효과, 이미지, 태그, 날짜) |
| `components/portfolio/portfolio-filters.tsx` | 카테고리 탭 + 검색 입력 (URL 쿼리 파라미터) |
| `components/portfolio/portfolio-list.tsx` | 서버 컴포넌트, 에러/빈 상태 처리 |
| `components/portfolio/notion-renderer.tsx` | Notion 블록 → HTML 렌더링 (리스트 그룹화 포함) |

### 아직 미구현 (이번 로드맵 대상)

| 항목 | 우선순위 | 해당 Phase |
|------|----------|-----------|
| `.env.local` 생성 (환경 변수) | P0 | Phase 1 |
| `next.config.ts` 이미지 도메인 설정 | P0 | Phase 1 |
| Notion DB 스키마 생성 + 샘플 데이터 입력 | P0 | Phase 1 |
| React Query 커스텀 훅 (`useProjects`, `useProject`) | P1 | Phase 2 |
| 데이터 검증 레이어 (런타임 타입 가드) | P1 | Phase 2 |
| 홈 페이지 Featured 프로젝트 섹션 | P0 | Phase 4 |
| Navbar ThemeToggle 통합 | P2 | Phase 4 |
| SEO: `sitemap.ts`, `robots.ts` | P2 | Phase 4 |
| 에러 페이지: `not-found.tsx`, `error.tsx` | P1 | Phase 3 |
| 페이지네이션 UI ("더 보기" 버튼) | P1 | Phase 3 |
| About 페이지 | P3 | Phase 4 |
| Vercel 배포 | P0 | Phase 5 |
| 성능 최적화 (Lighthouse, Core Web Vitals) | P2 | Phase 5 |
| 분석 도구 연동 (Vercel Analytics) | P3 | Phase 5 |

---

## Phase 1: 프로젝트 초기 설정 (골격)

**기간**: 3일 (2026-03-05 ~ 2026-03-07)
**목표**: Notion API 연동 환경 구성, 기본 라우팅 구조 확인, 핵심 타입 정의 검토
**팀 구성**: 풀스택 개발자 1명

### 1-1. Notion API 연동 환경 설정

- **설명**: Notion API 키와 데이터베이스 ID를 `.env.local`에 설정하고, PRD 4.1 스키마에 맞는 Notion 데이터베이스를 생성한다
- **사용자 스토리**: 개발자로서 로컬 환경에서 실제 Notion 데이터에 연결하여 API 연동을 확인하고 싶다
- **수락 기준**:
  - [ ] `.env.local` 파일 생성 (`NOTION_API_KEY`, `NOTION_DATABASE_ID` 설정)
  - [ ] Notion Integration 생성 후 데이터베이스에 연결 권한 부여
  - [ ] Notion DB에 PRD 4.1 스키마 필드 전체 생성 (title, category, description, tags, publishedDate, image, content, externalLink, featured, status)
  - [ ] 샘플 프로젝트 3개 이상 입력 (카테고리별 1개: 웹, 모바일, 디자인)
  - [ ] `npm run dev` 실행 후 콘솔 경고 없이 서버 기동 확인
- **기술 고려사항**:
  - `lib/notion/client.ts`는 환경 변수 미설정 시 `console.warn` 출력 (이미 구현됨)
  - `.env.local`은 `.gitignore`에 포함 필수 (NOTION_API_KEY 노출 금지)
  - Notion API v5 기준: `notion.dataSources.query()` 사용 (`databases.query()` 대체됨)
  - `NOTION_DATABASE_ID`는 Notion DB URL의 마지막 32자리 (하이픈 제외)
- **생성/수정 파일**:
  - `.env.local` (신규 생성, 커밋 금지)
- **복잡도**: Low
- **의존성**: 없음
- **테스트 계획**:
  - 환경 변수 검증: `node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.NOTION_API_KEY ? 'OK' : 'MISSING')"`
  - Notion API 연결: `curl` 또는 간단한 Node.js 스크립트로 DB 조회 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 1-2. Next.js 이미지 도메인 설정

- **설명**: Notion 이미지 URL 도메인을 `next.config.ts`의 `remotePatterns`에 등록하여 `next/image` 최적화 활성화
- **사용자 스토리**: 방문자로서 포트폴리오 카드에서 프로젝트 썸네일 이미지를 볼 수 있어야 한다
- **수락 기준**:
  - [ ] `next.config.ts` 생성 (또는 수정) 후 `remotePatterns` 설정
  - [ ] 허용 도메인: `notion.so`, `s3.us-west-2.amazonaws.com`, `prod-files-secure.s3.us-west-2.amazonaws.com`, `images.unsplash.com` (외부 이미지 테스트용)
  - [ ] `npm run dev` 후 이미지 포함 프로젝트 카드에서 썸네일 정상 표시
  - [ ] 이미지 없는 프로젝트에서 플레이스홀더(카테고리명) 정상 표시
- **기술 고려사항**:
  - `domains` 설정은 Next.js 13+에서 deprecated. `remotePatterns` 사용 필수
  - Notion 내부 파일 URL (`file` 타입)과 외부 URL (`external` 타입) 모두 존재
  - `parser.ts`의 `extractCoverUrl()` + `extractFileUrl()`이 양쪽 처리 완료
  - Notion 파일 URL 유효기간: 약 1시간. ISR 60초 설정으로 대부분 커버
- **생성/수정 파일**:
  - `next.config.ts` (신규 생성)
- **복잡도**: Low
- **의존성**: 1-1
- **테스트 계획**:
  - UI 테스트 (Playwright): `/portfolio` 페이지에서 이미지 렌더링 스냅샷 촬영
  - 콘솔 에러 확인: `next/image` hostname 미설정 오류 미발생 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 1-3. 기본 라우팅 구조 검토 및 확인

- **설명**: 기존 구현된 라우팅 구조(`/portfolio`, `/portfolio/[id]`, `/api/projects`)가 Next.js 16 App Router 규칙에 맞는지 검토하고, Navbar 네비게이션 링크 정합성 확인
- **사용자 스토리**: 개발자로서 전체 라우팅 구조가 일관성 있게 동작하는지 확인하고 싶다
- **수락 기준**:
  - [ ] `app/portfolio/page.tsx` - 포트폴리오 목록 라우트 정상 접근 (`/portfolio`)
  - [ ] `app/portfolio/[id]/page.tsx` - 상세 페이지 라우트 정상 접근 (`/portfolio/abc123`)
  - [ ] `app/api/projects/route.ts` - API 정상 응답 (`/api/projects`)
  - [ ] `app/api/projects/[id]/route.ts` - API 정상 응답 (`/api/projects/:id`)
  - [ ] Navbar의 "홈", "포트폴리오" 링크 정상 동작
  - [ ] `app/page.tsx` 홈 페이지 정상 렌더링
- **기술 고려사항**:
  - Next.js 16 App Router: `searchParams`는 `Promise<{...}>` 타입 (이미 `app/portfolio/page.tsx`에 반영됨)
  - `params`도 `Promise<{id: string}>` 타입 (이미 상세 페이지에 반영됨)
  - `generateStaticParams`는 빌드 시 Notion API 호출 (빌드 환경에도 env 필요)
- **생성/수정 파일**: 없음 (검토만)
- **복잡도**: Low
- **의존성**: 1-1, 1-2
- **테스트 계획**:
  - 브라우저에서 각 라우트 직접 접근
  - API 테스트: `curl http://localhost:3000/api/projects` 응답 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 1-4. TypeScript 타입 정의 검토 및 보완

- **설명**: `types/notion.ts`에 정의된 타입이 실제 Notion API 응답 구조와 일치하는지 확인하고, 필요 시 보완
- **사용자 스토리**: 개발자로서 타입 안전성을 유지하며 Notion 데이터를 다루고 싶다
- **수락 기준**:
  - [ ] `npm run build` 또는 `npx tsc --noEmit` 실행 시 타입 오류 없음
  - [ ] `types/notion.ts`의 `Project`, `ProjectSummary`, `NotionBlock` 타입이 실제 파싱 결과와 일치
  - [ ] `types/index.ts` 배럴 익스포트 정상 동작
  - [ ] `lib/notion/parser.ts`의 `parseProjectPage()` 반환 타입이 `ProjectSummary`와 완전 일치
- **기술 고려사항**:
  - `ProjectCategory` 타입: `"웹" | "모바일" | "디자인" | "기타"` (PRD 4.1 기준)
  - `ProjectStatus` 타입: `"진행중" | "완료" | "보관"` (PRD 4.1 기준)
  - `PaginatedProjects.total`은 optional (Notion API가 total 미지원)
  - `any` 타입 사용 부분 검토 (`parser.ts`에 다수 존재 - Notion API 타입 한계)
- **생성/수정 파일**:
  - `types/notion.ts` (필요 시 보완)
  - `types/index.ts` (필요 시 보완)
- **복잡도**: Low
- **의존성**: 없음
- **테스트 계획**:
  - `npx tsc --noEmit` 실행하여 타입 에러 제로 확인
  - IDE 자동완성으로 타입 추론 정상 동작 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

**Phase 1 완료 기준**:
- [ ] `.env.local` 환경 변수 설정 완료
- [ ] `next.config.ts` 이미지 도메인 설정 완료
- [ ] Notion DB 스키마 생성 + 샘플 데이터 3개 이상 입력
- [ ] `npm run dev` 실행 후 `/portfolio` 에서 데이터 조회 확인 (환경 변수 미설정 경고 없음)
- [ ] TypeScript 컴파일 오류 없음 (`npx tsc --noEmit`)

---

## Phase 2: 공통 모듈 개발

**기간**: 4일 (2026-03-08 ~ 2026-03-11)
**목표**: Notion API 클라이언트 래퍼 안정화, 데이터 변환/검증 레이어 구축, React Query 연동
**팀 구성**: 풀스택 개발자 1명
**선행 조건**: Phase 1 완료

### 2-1. Notion API 클라이언트 래퍼 안정화

- **설명**: 기존 `lib/notion/client.ts`와 `queries.ts`에 에러 핸들링, 재시도 로직, 레이트 리밋 대응을 강화
- **사용자 스토리**: 개발자로서 Notion API 오류(인증 실패, 레이트 리밋, 네트워크 오류)를 예측 가능하게 처리하고 싶다
- **수락 기준**:
  - [ ] Notion API 401 (인증 실패) 시 명확한 에러 메시지 반환
  - [ ] Notion API 429 (레이트 리밋) 시 콘솔에 경고 로그 출력
  - [ ] Notion API 네트워크 타임아웃 시 `null` 또는 빈 배열 반환 (앱 크래시 방지)
  - [ ] `getProjects()` 실패 시 `PortfolioList`에서 에러 UI 표시
  - [ ] `getProjectById()` 실패 시 `notFound()` 호출 (이미 구현됨, 동작 확인)
- **기술 고려사항**:
  - Notion API 레이트 리밋: 초당 3회 요청. ISR 캐싱으로 실제 빈도는 낮음
  - `queries.ts`의 `getProjectById()`는 이미 `try/catch`로 `null` 반환 구현됨
  - `getAllProjectIds()`도 이미 while 루프로 페이지네이션 처리됨
  - 추가 개선: 에러 유형별 분기 처리 (NotionAPIError 타입 확인)
- **생성/수정 파일**:
  - `lib/notion/client.ts` (에러 핸들링 보강)
  - `lib/notion/queries.ts` (에러 분기 개선)
- **복잡도**: Medium
- **의존성**: Phase 1 완료
- **테스트 계획**:
  - API 테스트: 잘못된 API 키로 요청 시 에러 메시지 확인
  - API 테스트: 잘못된 DB ID로 요청 시 에러 처리 확인
  - 통합 테스트: `portfolio-list.tsx` 에러 UI 렌더링 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 2-2. 데이터 변환 및 검증 레이어

- **설명**: `parser.ts`에서 변환된 데이터의 런타임 타입 검증을 추가하고, 엣지 케이스(빈 제목, 잘못된 날짜 형식, 빈 카테고리) 처리를 강화
- **사용자 스토리**: 개발자로서 Notion DB에 불완전한 데이터가 있어도 앱이 비정상 종료되지 않기를 원한다
- **수락 기준**:
  - [ ] 제목이 없는 Notion 페이지 → `"제목 없음"` 기본값 적용 (이미 구현됨, 확인)
  - [ ] 카테고리 없는 프로젝트 → `"기타"` 기본값 적용 (이미 구현됨, 확인)
  - [ ] 날짜 형식 오류 시 `null` 반환 (화면에서 날짜 항목 미표시)
  - [ ] 이미지 URL이 만료된 경우 플레이스홀더 표시 (이미 `project-card.tsx`에서 처리됨)
  - [ ] `tags` 필드가 비어있어도 빈 배열 반환 (앱 크래시 없음)
- **기술 고려사항**:
  - `parser.ts`에서 `any` 타입 광범위 사용 - Notion API 타입 한계상 불가피
  - 런타임 검증이 필요한 부분: `publishedDate` 파싱 (Date 객체 유효성)
  - `parseProjectPage()` 함수의 각 필드별 기본값 처리 이미 구현됨 (코드 재확인)
  - 날짜 처리: `date-fns`의 `isValid()` 활용 권장
- **생성/수정 파일**:
  - `lib/notion/parser.ts` (엣지 케이스 보완)
- **복잡도**: Low
- **의존성**: Phase 1, 2-1
- **테스트 계획**:
  - 단위 테스트: 빈 Notion 페이지 객체로 `parseProjectPage()` 호출 시 기본값 반환 확인
  - 엣지 케이스: Notion DB에서 일부 필드 비워둔 프로젝트 생성 후 목록 표시 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 2-3. React Query 커스텀 훅 구현

- **설명**: 클라이언트 사이드에서 포트폴리오 데이터를 조회하는 React Query 커스텀 훅 구현. 페이지네이션과 필터 변경 시 자동 재조회 지원
- **사용자 스토리**: 개발자로서 클라이언트 컴포넌트에서 포트폴리오 데이터를 쉽게 조회하고 캐싱된 결과를 재활용하고 싶다
- **수락 기준**:
  - [ ] `hooks/use-projects.ts` - 프로젝트 목록 조회 훅 (필터, 검색, 페이지네이션)
  - [ ] `hooks/use-project.ts` - 단일 프로젝트 조회 훅
  - [ ] 로딩 상태 (`isLoading`) 반환
  - [ ] 에러 상태 (`error`) 반환
  - [ ] `staleTime: 60_000` 설정 (기존 `query-provider.tsx` 기본값과 일치)
  - [ ] 카테고리/검색 변경 시 자동 재조회 (queryKey에 파라미터 포함)
- **기술 고려사항**:
  - `components/providers/query-provider.tsx`에 이미 `QueryClient` 설정 완료 (staleTime 60초)
  - `@tanstack/react-query`의 `useQuery`, `useInfiniteQuery` 중 선택
  - 페이지네이션: `useInfiniteQuery`로 "더 보기" 패턴 지원 (Phase 3에서 UI 구현)
  - API 호출: `GET /api/projects?category=...&search=...&cursor=...`
  - 서버 컴포넌트에서는 직접 `getProjects()` 호출. 클라이언트 컴포넌트에서만 훅 사용
- **생성/수정 파일**:
  - `hooks/use-projects.ts` (신규)
  - `hooks/use-project.ts` (신규)
  - `hooks/index.ts` (신규, 배럴 익스포트)
- **복잡도**: Medium
- **의존성**: Phase 1, 2-1
- **테스트 계획**:
  - 통합 테스트: 훅을 사용하는 클라이언트 컴포넌트에서 데이터 조회 확인
  - 캐시 테스트: 동일 파라미터로 2회 호출 시 네트워크 요청 1회만 발생 확인
  - 에러 테스트: API 오류 시 `error` 상태 반환 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

**Phase 2 완료 기준**:
- [ ] Notion API 오류 상황에서 앱 크래시 없이 에러 UI 표시
- [ ] 빈 필드가 포함된 Notion 데이터에서 기본값 적용 확인
- [ ] `hooks/use-projects.ts`, `hooks/use-project.ts` 구현 완료
- [ ] TypeScript 컴파일 오류 없음

---

## Phase 3: 핵심 기능 개발

**기간**: 5일 (2026-03-12 ~ 2026-03-16)
**목표**: 프로젝트 목록/상세 페이지 완성도 향상, 에러 페이지 구현, 페이지네이션 UI 추가
**팀 구성**: 풀스택 개발자 1명
**선행 조건**: Phase 2 완료

### 3-1. 프로젝트 목록 페이지 완성

- **설명**: 기존 `app/portfolio/page.tsx`와 관련 컴포넌트를 실제 Notion 데이터로 검증하고, 로딩 상태, 빈 결과 처리, 결과 카운트 표시를 완성
- **사용자 스토리**: 방문자로서 포트폴리오 목록 페이지에서 모든 프로젝트를 카드 그리드로 확인하고, 카테고리/검색으로 필터링할 수 있어야 한다
- **수락 기준**:
  - [ ] `/portfolio` 접근 시 Notion DB의 실제 프로젝트 데이터 표시
  - [ ] 카드 그리드: 모바일 1열, 태블릿 2열, 데스크톱 3열 반응형 레이아웃
  - [ ] 프로젝트 카드: 썸네일, 카테고리 배지, 제목, 설명(3줄 말줄임), 태그, 날짜 표시
  - [ ] 로딩 중 스켈레톤 6개 표시 (Suspense fallback 이미 구현됨)
  - [ ] 검색 결과 없음 시 안내 메시지 표시
  - [ ] `총 N개의 프로젝트` 카운트 텍스트 표시
  - [ ] ISR `revalidate = 60` 동작 확인 (Notion 데이터 수정 후 60초 내 반영)
- **기술 고려사항**:
  - `portfolio-list.tsx`는 서버 컴포넌트로 구현됨 (데이터 페칭 서버에서 처리)
  - `portfolio-filters.tsx`는 클라이언트 컴포넌트 (URL 쿼리 파라미터 기반)
  - 검색은 클라이언트 사이드 필터링 방식 (Notion API 텍스트 검색 미지원)
  - 대량 데이터(100개+) 시 검색 성능 저하 가능 - 현 단계에서는 허용 범위
- **생성/수정 파일**:
  - `app/portfolio/page.tsx` (검토 및 필요 시 개선)
  - `components/portfolio/portfolio-list.tsx` (에러 UI 개선)
  - `components/portfolio/project-card.tsx` (검토)
- **복잡도**: Low
- **의존성**: Phase 1, Phase 2
- **테스트 계획**:
  - API 테스트: `GET /api/projects` 응답에 `projects`, `hasMore`, `nextCursor` 필드 확인
  - UI 테스트 (Playwright): `/portfolio` 페이지 스냅샷, 카드 그리드 렌더링 확인
  - UI 테스트 (Playwright): `/portfolio?category=웹` 필터링 후 결과 확인
  - UI 테스트 (Playwright): `/portfolio?search=React` 검색 후 결과 확인
  - 반응형 테스트: 375px(모바일), 768px(태블릿), 1280px(데스크톱) 뷰포트 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 3-2. 프로젝트 상세 페이지 완성

- **설명**: 기존 `app/portfolio/[id]/page.tsx`에서 Notion 블록 콘텐츠 렌더링을 검증하고, 외부 링크 버튼, 메타 정보, 이미지 등 완성도 확인
- **사용자 스토리**: 방문자로서 프로젝트 상세 페이지에서 프로젝트의 전체 내용을 읽고, GitHub/데모 링크로 이동할 수 있어야 한다
- **수락 기준**:
  - [ ] `/portfolio/[id]` 접근 시 해당 프로젝트 상세 정보 표시
  - [ ] 썸네일 이미지 표시 (없을 경우 이미지 영역 미표시)
  - [ ] 카테고리 배지, 태그 배지, 날짜, 설명 표시
  - [ ] 외부 링크 버튼 표시 (externalLink 있을 경우)
  - [ ] Notion 블록 콘텐츠 렌더링 (heading, paragraph, code, image, list, quote, callout, divider)
  - [ ] "포트폴리오로 돌아가기" 버튼 정상 동작
  - [ ] 존재하지 않는 ID 접근 시 404 페이지 표시 (이미 `notFound()` 구현됨)
  - [ ] 동적 메타데이터 (`<title>`, OG 태그) 생성 확인
- **기술 고려사항**:
  - `generateStaticParams()`로 빌드 시 정적 경로 사전 생성 (이미 구현됨)
  - `notion-renderer.tsx`의 리스트 그룹화 로직 (`flushList()`) 동작 확인
  - 코드 블록 언어 표시 (Python, JavaScript 등)
  - 이미지 블록에서 Notion 내부 파일 URL 만료 이슈 주의
- **생성/수정 파일**:
  - `app/portfolio/[id]/page.tsx` (검토 및 필요 시 개선)
  - `components/portfolio/notion-renderer.tsx` (검토)
- **복잡도**: Low
- **의존성**: Phase 1, Phase 2
- **테스트 계획**:
  - API 테스트: `GET /api/projects/[id]` 응답에 `content` 블록 배열 포함 확인
  - UI 테스트 (Playwright): 상세 페이지 스냅샷 촬영 및 주요 요소 존재 확인
  - UI 테스트 (Playwright): "포트폴리오로 돌아가기" 버튼 클릭 후 `/portfolio` 이동 확인
  - UI 테스트 (Playwright): 존재하지 않는 ID 접근 시 404 표시 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 3-3. 필터링 및 검색 기능 완성

- **설명**: 기존 `portfolio-filters.tsx`의 카테고리 필터와 검색 기능을 실제 데이터로 검증하고, 검색 UX(디바운스, 초기화 버튼) 개선
- **사용자 스토리**: 방문자로서 카테고리 탭을 클릭하거나 검색어를 입력하여 원하는 프로젝트를 빠르게 찾을 수 있어야 한다
- **수락 기준**:
  - [ ] 카테고리 탭 클릭 시 URL 쿼리 파라미터 변경 및 결과 필터링
  - [ ] 검색 입력 후 "검색" 버튼 클릭 시 결과 반영
  - [ ] 검색 초기화 버튼 (X) 동작
  - [ ] 카테고리 변경 시 로딩 인디케이터 표시 (`isPending` 상태 활용, 이미 구현됨)
  - [ ] URL 공유 시 필터 상태 유지 (`/portfolio?category=웹&search=React`)
  - [ ] 브라우저 뒤로가기 시 이전 필터 상태 복원
- **기술 고려사항**:
  - `portfolio-filters.tsx`는 이미 `useRouter`, `useTransition` 활용하여 구현됨
  - 검색은 폼 제출 방식 (Enter 또는 버튼 클릭). 실시간 검색 미지원 (서버 왕복 필요)
  - 검색 결과 0개 시 `portfolio-list.tsx`에서 안내 메시지 표시 (이미 구현됨)
  - URL 파라미터 기반이므로 SEO 친화적, 공유 가능
- **생성/수정 파일**:
  - `components/portfolio/portfolio-filters.tsx` (검토 및 개선)
- **복잡도**: Low
- **의존성**: 3-1
- **테스트 계획**:
  - UI 테스트 (Playwright): 카테고리 "웹" 클릭 → URL `?category=웹` 변경 확인
  - UI 테스트 (Playwright): 검색어 입력 → 검색 버튼 클릭 → 결과 갱신 확인
  - UI 테스트 (Playwright): 검색 초기화 버튼 클릭 후 전체 목록 복원 확인
  - URL 공유 테스트: `/portfolio?category=웹` 직접 접근 시 "웹" 탭 활성화 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 3-4. 에러 페이지 구현

- **설명**: 404 Not Found 페이지, 전역 에러 페이지, 포트폴리오 섹션 에러 경계 구현
- **사용자 스토리**: 방문자로서 존재하지 않는 페이지나 서버 오류 상황에서도 친절한 안내를 받고 홈으로 돌아갈 수 있어야 한다
- **수락 기준**:
  - [ ] `app/not-found.tsx` 생성 - 커스텀 404 페이지 (포트폴리오로 돌아가기 버튼 포함)
  - [ ] `app/error.tsx` 생성 - 전역 에러 페이지 (`"use client"` 필수)
  - [ ] `app/portfolio/error.tsx` 생성 - 포트폴리오 섹션 에러 경계
  - [ ] 존재하지 않는 URL 접근 시 커스텀 404 페이지 표시
  - [ ] Notion API 연결 실패 시 포트폴리오 에러 경계에서 재시도 버튼 표시
  - [ ] 모든 에러 페이지에 홈으로 이동 링크 제공
- **기술 고려사항**:
  - Next.js 16 파일 기반 에러 처리: `not-found.tsx`, `error.tsx` 자동 인식
  - `error.tsx`는 반드시 `"use client"` 지시자 필요
  - `error.tsx` props: `{ error: Error, reset: () => void }`
  - Navbar + Footer를 에러 페이지에서도 표시하려면 `app/layout.tsx`의 구조 활용
  - `portfolio-list.tsx`에 이미 기본 에러 UI 있음 (개선 및 `error.tsx`와 역할 분리)
- **생성/수정 파일**:
  - `app/not-found.tsx` (신규)
  - `app/error.tsx` (신규)
  - `app/portfolio/error.tsx` (신규)
- **복잡도**: Low
- **의존성**: Phase 1 완료
- **테스트 계획**:
  - UI 테스트 (Playwright): `/non-existent-route` 접근 시 커스텀 404 페이지 표시 확인
  - UI 테스트 (Playwright): 에러 페이지에서 "홈으로" 링크 클릭 정상 동작 확인
  - 에러 시뮬레이션: `NOTION_API_KEY`를 잘못된 값으로 변경 후 에러 경계 동작 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 3-5. 페이지네이션 UI ("더 보기" 버튼) 구현

- **설명**: 포트폴리오 목록에서 12개 초과 시 "더 보기" 버튼으로 추가 프로젝트를 로드하는 UX 구현
- **사용자 스토리**: 방문자로서 많은 프로젝트가 있을 때 "더 보기" 버튼으로 추가 프로젝트를 불러올 수 있어야 한다
- **수락 기준**:
  - [ ] 초기 12개 표시, `hasMore=true`일 때 "더 보기" 버튼 표시
  - [ ] "더 보기" 클릭 시 다음 12개 기존 목록 하단에 append
  - [ ] 마지막 페이지 도달 시 "더 보기" 버튼 숨김
  - [ ] 로딩 중 버튼에 스피너 표시
  - [ ] 카테고리/검색 변경 시 페이지네이션 초기화 (첫 페이지로 리셋)
- **기술 고려사항**:
  - `queries.ts`의 `getProjects()`는 이미 `nextCursor`, `hasMore` 반환 (구현 완료)
  - API 라우트 `/api/projects?cursor=...`로 클라이언트에서 호출
  - `hooks/use-projects.ts`의 `useInfiniteQuery` 활용 권장
  - 현재 `PortfolioList`는 서버 컴포넌트 - "더 보기" 버튼은 클라이언트 컴포넌트로 분리 필요
  - 구현 전략: 서버 컴포넌트(초기 데이터) + 클라이언트 컴포넌트(더 보기) 혼합 패턴
  - 대안: URL 기반 페이지네이션 (`?page=2`) - 더 단순하고 URL 공유 가능
- **생성/수정 파일**:
  - `components/portfolio/load-more-button.tsx` (신규)
  - `components/portfolio/portfolio-list.tsx` (페이지네이션 통합)
  - `app/portfolio/page.tsx` (필요 시 수정)
- **복잡도**: Medium
- **의존성**: Phase 2 (React Query 훅), 3-1
- **테스트 계획**:
  - 전제조건: Notion DB에 13개 이상 완료 프로젝트 존재
  - UI 테스트 (Playwright): 목록 페이지에서 "더 보기" 버튼 존재 확인
  - UI 테스트 (Playwright): "더 보기" 클릭 후 카드 수 증가 확인
  - UI 테스트 (Playwright): 마지막 페이지에서 버튼 미표시 확인
  - 필터 리셋 테스트: 카테고리 변경 시 페이지네이션 초기화 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

**Phase 3 완료 기준**:
- [ ] 포트폴리오 목록 페이지 실제 Notion 데이터로 정상 동작
- [ ] 프로젝트 상세 페이지 블록 콘텐츠 렌더링 확인
- [ ] 카테고리 필터 및 검색 기능 정상 동작
- [ ] 404 및 에러 페이지 정상 표시
- [ ] "더 보기" 버튼으로 추가 데이터 로드 확인
- [ ] 모바일/태블릿/데스크톱 반응형 레이아웃 확인

---

## Phase 4: 추가 기능 개발

**기간**: 5일 (2026-03-17 ~ 2026-03-21)
**목표**: 홈 페이지 Featured 섹션 완성, SEO 최적화, 다크모드 연동, 반응형 디자인 완성
**팀 구성**: 풀스택 개발자 1명
**선행 조건**: Phase 3 완료

### 4-1. 홈 페이지 Featured 프로젝트 섹션 구현

- **설명**: `app/page.tsx`에 Notion `featured=true` 프로젝트를 최대 6개 표시하는 섹션 추가. 기존 Hero, Features, Cta 섹션과 시각적 통합
- **사용자 스토리**: 채용 담당자로서 홈 페이지에서 가장 중요한 프로젝트 6개를 즉시 확인하고 포트폴리오 전체로 이동할 수 있어야 한다
- **수락 기준**:
  - [ ] 홈 페이지(`/`)에 Featured 프로젝트 카드 그리드 섹션 표시
  - [ ] Notion DB에서 `featured=true`, `status=완료` 프로젝트 최대 6개 조회
  - [ ] 각 카드 클릭 시 `/portfolio/[id]` 상세 페이지로 이동
  - [ ] Featured 프로젝트 없을 때 graceful 처리 (섹션 미표시 또는 안내 메시지)
  - [ ] ISR `revalidate = 60` 적용
  - [ ] "전체 포트폴리오 보기" 버튼 → `/portfolio` 링크
  - [ ] 기존 Hero, Features, Cta 섹션과 시각적 일관성 유지
- **기술 고려사항**:
  - `lib/notion/queries.ts`의 `getFeaturedProjects()`는 이미 구현됨
  - `components/portfolio/project-card.tsx` 재사용 가능
  - 서버 컴포넌트로 구현 (데이터 페칭은 서버에서)
  - 신규 컴포넌트 `components/sections/featured-projects.tsx` 생성
  - 홈 페이지에 `export const revalidate = 60` 추가 필요
- **생성/수정 파일**:
  - `components/sections/featured-projects.tsx` (신규)
  - `components/sections/index.ts` (배럴 익스포트 추가)
  - `app/page.tsx` (Featured 섹션 통합, revalidate 추가)
- **복잡도**: Medium
- **의존성**: Phase 1, Phase 3 완료
- **테스트 계획**:
  - API 테스트: `GET /api/projects?featured=true` 응답 확인
  - UI 테스트 (Playwright): 홈 페이지 스냅샷에서 Featured 섹션 존재 확인
  - UI 테스트 (Playwright): 프로젝트 카드 클릭 후 상세 페이지 이동 확인
  - UI 테스트 (Playwright): "전체 포트폴리오 보기" 클릭 후 `/portfolio` 이동 확인
  - Featured 없음 처리: Notion DB에서 featured 프로젝트 모두 해제 후 홈 페이지 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 4-2. SEO 최적화

- **설명**: 각 페이지 동적 메타데이터 완성, Sitemap 자동 생성, robots.txt 생성, 구조화 데이터(JSON-LD) 추가
- **사용자 스토리**: 검색 엔진이 포트폴리오 사이트를 잘 크롤링하여 검색 결과에 노출되기를 원한다
- **수락 기준**:
  - [ ] 홈 페이지 메타데이터 완성 (title, description, OG 태그)
  - [ ] 포트폴리오 목록 페이지 메타데이터 검토 (이미 구현됨)
  - [ ] 프로젝트 상세 페이지 동적 메타데이터 검토 (이미 `generateMetadata` 구현됨)
  - [ ] `app/sitemap.ts` 생성 - `getAllProjectIds()` 활용하여 동적 sitemap 생성
  - [ ] `app/robots.ts` 생성
  - [ ] 프로젝트 상세 페이지에 `Article` Schema.org JSON-LD 추가
  - [ ] `next.config.ts`에 `metadataBase` 설정 (개발환경: `localhost:3000`)
  - [ ] Lighthouse SEO 점수 90점 이상
- **기술 고려사항**:
  - Next.js 16의 `generateMetadata` API 이미 상세 페이지에 구현됨 (검토만)
  - Sitemap: `getAllProjectIds()` 호출로 모든 완료 프로젝트 URL 포함
  - OG 이미지: Notion 이미지 URL 사용 (만료 이슈 있음). Next.js OG 이미지 생성은 Phase 5에서 고려
  - Schema.org JSON-LD: `<script type="application/ld+json">` 형식으로 상세 페이지에 삽입
  - `metadataBase`는 배포 후 실제 도메인으로 업데이트 필요
- **생성/수정 파일**:
  - `app/sitemap.ts` (신규)
  - `app/robots.ts` (신규)
  - `app/page.tsx` (홈 메타데이터 추가)
  - `app/portfolio/[id]/page.tsx` (JSON-LD 추가)
  - `next.config.ts` (metadataBase 설정)
- **복잡도**: Medium
- **의존성**: Phase 1 완료
- **테스트 계획**:
  - SEO 테스트: `curl localhost:3000/sitemap.xml` 응답 형식 확인
  - SEO 테스트: `curl localhost:3000/robots.txt` 응답 확인
  - UI 테스트 (Playwright): 상세 페이지 `<head>` 태그 내 OG 태그 존재 확인
  - Lighthouse: SEO 탭 점수 90점 이상 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 4-3. 다크모드 Navbar 통합

- **설명**: 기존 `next-themes` 기반 `ThemeToggle`을 Navbar에 추가하여 라이트/다크/시스템 모드 전환 지원
- **사용자 스토리**: 방문자로서 Navbar의 토글 버튼으로 라이트/다크 모드를 전환하여 편안하게 포트폴리오를 볼 수 있어야 한다
- **수락 기준**:
  - [ ] Navbar 우측에 ThemeToggle 버튼 표시
  - [ ] 라이트/다크/시스템 모드 전환 정상 동작
  - [ ] 포트폴리오 목록, 상세, 홈 페이지 모두 다크모드 적용
  - [ ] 새로고침 후에도 선택한 테마 유지 (next-themes localStorage 기반)
  - [ ] 모바일 Sheet 드로어에서도 ThemeToggle 표시
  - [ ] 다크모드에서 모든 UI 요소 가독성 유지 (카드, 배지, 코드 블록, 이미지 플레이스홀더)
- **기술 고려사항**:
  - `components/providers/theme-toggle.tsx` 이미 구현됨 (DropdownMenu 기반)
  - `app/layout.tsx`에 `ThemeProvider` 이미 포함됨 (Providers 컴포넌트 통해)
  - `globals.css`에 `@custom-variant dark` CSS 변수 이미 설정됨
  - `components/layout/navbar.tsx`에 ThemeToggle 추가만 필요
  - `suppressHydrationWarning`이 `<html>` 태그에 설정 여부 확인 (`app/layout.tsx`)
  - 포트폴리오 컴포넌트에서 TailwindCSS `dark:` 접두사 클래스 점검 필요
- **생성/수정 파일**:
  - `components/layout/navbar.tsx` (ThemeToggle 통합)
- **복잡도**: Low
- **의존성**: Phase 3 완료
- **테스트 계획**:
  - UI 테스트 (Playwright): Navbar에서 ThemeToggle 버튼 존재 확인
  - UI 테스트 (Playwright): 다크모드 전환 후 배경색 변경 확인 (스크린샷 비교)
  - UI 테스트 (Playwright): 새로고침 후 다크모드 유지 확인
  - 반응형 테스트: 모바일 Sheet 드로어에서 ThemeToggle 표시 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 4-4. 반응형 디자인 완성 및 접근성 검토

- **설명**: 모든 페이지에서 모바일/태블릿/데스크톱 반응형 레이아웃을 검증하고, 키보드 네비게이션 및 스크린 리더 접근성을 확인
- **사용자 스토리**: 모바일 사용자로서 스마트폰에서도 포트폴리오를 편하게 탐색할 수 있어야 한다
- **수락 기준**:
  - [ ] 375px (모바일): 1열 카드 그리드, Navbar 햄버거 메뉴, 단일 컬럼 레이아웃
  - [ ] 768px (태블릿): 2열 카드 그리드, 필터 탭 정상 표시
  - [ ] 1280px (데스크톱): 3열 카드 그리드, 전체 Navbar 메뉴 표시
  - [ ] 모든 버튼/링크 Tab 키로 포커스 이동 가능
  - [ ] 이미지에 의미 있는 `alt` 텍스트 설정
  - [ ] 스크린 리더 대응: 주요 랜드마크 태그 (`<main>`, `<nav>`, `<header>`, `<footer>`)
  - [ ] shadcn/ui + Radix UI 기본 접근성(WAI-ARIA) 동작 확인
- **기술 고려사항**:
  - Navbar의 모바일 Sheet 드로어는 이미 구현됨 (`components/layout/navbar.tsx`)
  - `project-card.tsx`의 `sizes` prop이 반응형에 맞게 설정됨 (이미 구현됨)
  - iOS Safari의 CSS 호환성 주의 (특히 `backdrop-filter`)
  - `portfolio-filters.tsx`의 카테고리 탭이 좁은 화면에서 wrapping 처리됨 (확인 필요)
- **생성/수정 파일**: 없음 (검토 및 수정)
- **복잡도**: Low
- **의존성**: Phase 3 완료
- **테스트 계획**:
  - UI 테스트 (Playwright): `browser_resize`로 375px, 768px, 1280px 뷰포트 각각 스냅샷
  - 접근성 테스트: Tab 키 네비게이션으로 모든 인터랙티브 요소 접근 확인
  - Lighthouse: 접근성(Accessibility) 점수 90점 이상 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

**Phase 4 완료 기준**:
- [ ] 홈 페이지 Featured 섹션에서 실제 Notion 데이터 표시
- [ ] Sitemap, robots.txt 정상 생성
- [ ] 다크모드 모든 페이지에서 정상 동작
- [ ] 모바일/태블릿/데스크톱 반응형 레이아웃 완성
- [ ] Lighthouse SEO 점수 90점 이상

---

## Phase 5: 최적화 및 배포

**기간**: 5일 (2026-03-22 ~ 2026-03-26)
**목표**: 성능 최적화, Vercel 배포 완료, 모니터링 설정
**팀 구성**: 풀스택 개발자 1명
**선행 조건**: Phase 4 완료

### 5-1. 성능 최적화

- **설명**: Lighthouse 성능 점수 개선, 번들 크기 최적화, Core Web Vitals 통과 확인
- **사용자 스토리**: 방문자로서 사이트가 3초 이내에 로드되어 쾌적하게 포트폴리오를 탐색하고 싶다
- **수락 기준**:
  - [ ] Lighthouse 성능 점수 데스크톱 90점 이상, 모바일 80점 이상
  - [ ] Core Web Vitals 통과: LCP < 2.5s, CLS < 0.1, FID < 100ms
  - [ ] `next/image`의 `priority` prop이 최상단 이미지에 적용됨 (이미 상세 페이지에 구현됨)
  - [ ] ISR `revalidate = 60`이 모든 동적 페이지에 설정됨 (확인)
  - [ ] `npm run build` 후 번들 크기 리포트 확인
  - [ ] 불필요한 클라이언트 사이드 번들 최소화
- **기술 고려사항**:
  - `npm run build` 시 번들 분석: `@next/bundle-analyzer` 설치 후 확인 가능
  - Notion API 응답 캐싱: HTTP 헤더 `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` 이미 API 라우트에 적용됨
  - 폰트 최적화: `next/font`로 Geist 폰트 로컬 사전 로드 여부 확인
  - 동적 import: `notion-renderer.tsx`처럼 큰 컴포넌트는 필요 시 동적 import 고려
  - `generateStaticParams`로 빌드 시 정적 생성 페이지 수 모니터링
- **생성/수정 파일**:
  - `next.config.ts` (번들 분석 설정 추가)
  - 성능 저하 원인 파악 후 관련 컴포넌트 수정
- **복잡도**: Medium
- **의존성**: Phase 4 완료
- **테스트 계획**:
  - 성능 테스트 (Playwright): `browser_navigate` 후 페이지 로드 시간 측정
  - Lighthouse: 데스크톱/모바일 각각 성능 점수 측정
  - 번들 분석: `ANALYZE=true npm run build` 실행 후 번들 구성 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 5-2. 배포 준비 및 프로덕션 환경 설정

- **설명**: Vercel 배포를 위한 최종 점검. 환경 변수, 빌드 설정, 도메인 설정, 프로덕션 메타데이터 완성
- **사용자 스토리**: 개발자로서 포트폴리오 사이트를 실제 인터넷에서 접근 가능하도록 배포하고 싶다
- **수락 기준**:
  - [ ] `npm run build` 오류 없이 성공
  - [ ] `next.config.ts`의 `metadataBase`를 프로덕션 도메인으로 업데이트
  - [ ] `NOTION_API_KEY`, `NOTION_DATABASE_ID`를 Vercel 환경 변수에 설정 (`NEXT_PUBLIC_` 없이)
  - [ ] Vercel 프로젝트 생성 및 GitHub 레포지토리 연결
  - [ ] 배포된 프로덕션 URL에서 모든 페이지 정상 동작 확인
  - [ ] 커스텀 도메인 연결 (선택 사항)
- **기술 고려사항**:
  - Notion API 키는 서버 전용 환경 변수 (`NEXT_PUBLIC_` 접두사 없이 설정)
  - `generateStaticParams()`가 빌드 시 Notion API 호출 → 빌드 환경에도 API 키 필요
  - Vercel 무료 플랜: ISR 재검증 동작 확인 (Edge Function 포함)
  - `next.config.ts`의 `remotePatterns`에 Notion 이미지 도메인 설정 확인
  - 빌드 실패 원인 대부분: 환경 변수 미설정, TypeScript 오류, 이미지 도메인 미설정
- **생성/수정 파일**:
  - `next.config.ts` (metadataBase 프로덕션 도메인 설정)
  - Vercel 대시보드 환경 변수 설정 (코드 파일 아님)
- **복잡도**: Low
- **의존성**: Phase 4 완료, 5-1
- **테스트 계획**:
  - 빌드 테스트: `npm run build` 로컬 실행 후 오류 없음 확인
  - 배포 후 테스트 (Playwright): 프로덕션 URL에서 홈, 목록, 상세 페이지 확인
  - 환경 변수 테스트: 프로덕션에서 Notion 데이터 정상 조회 확인
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 5-3. 모니터링 설정

- **설명**: Vercel Analytics 연동으로 방문자 통계 수집, 에러 모니터링 설정 (선택)
- **사용자 스토리**: 개발자로서 어떤 프로젝트가 많이 조회되는지 확인하고 싶다
- **수락 기준**:
  - [ ] Vercel Analytics 또는 Google Analytics 4 연동
  - [ ] 페이지뷰 추적 정상 동작
  - [ ] Vercel 대시보드에서 방문자 통계 확인 가능
  - [ ] (선택) Sentry 연동 - 클라이언트/서버 에러 실시간 추적
- **기술 고려사항**:
  - Vercel Analytics: `@vercel/analytics` 패키지 설치 후 `app/layout.tsx`에 `<Analytics />` 추가
  - Google Analytics 4: `@next/third-parties` 활용 (Next.js 공식 지원)
  - GDPR 고려: 개인정보 수집 최소화 (Vercel Analytics는 익명 집계 방식)
  - Sentry: 무료 플랜으로 에러 수 제한 있음
- **생성/수정 파일**:
  - `app/layout.tsx` (Analytics 컴포넌트 추가)
- **복잡도**: Low
- **의존성**: 5-2 (배포 완료)
- **테스트 계획**:
  - Vercel 대시보드에서 페이지뷰 집계 확인 (배포 후 24시간 내)
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 5-4. 최종 QA 및 크로스 브라우저 테스트

- **설명**: 주요 브라우저(Chrome, Safari, Firefox)와 기기(모바일, 태블릿, 데스크톱)에서 전체 기능 검증
- **사용자 스토리**: 개발자로서 다양한 환경의 방문자 모두에게 일관된 경험을 제공하고 싶다
- **수락 기준**:
  - [ ] Chrome, Safari, Firefox 최신 버전에서 정상 동작
  - [ ] 모바일(375px), 태블릿(768px), 데스크톱(1280px, 1920px) 레이아웃 확인
  - [ ] 다크모드/라이트모드 모든 브라우저에서 정상 동작
  - [ ] 모든 링크 및 버튼 동작 확인 (깨진 링크 없음)
  - [ ] 키보드 네비게이션 접근성 확인 (Tab, Enter, Esc)
  - [ ] 이미지 `alt` 텍스트 확인 (스크린 리더 대응)
  - [ ] Lighthouse 최종 점수: 성능 90+, 접근성 90+, SEO 90+, Best Practices 90+
- **기술 고려사항**:
  - shadcn/ui + Radix UI는 기본적으로 WAI-ARIA 준수
  - iOS Safari: `backdrop-filter`, CSS 그리드 호환성 확인
  - `portfolio-filters.tsx`의 URL 전환 시 Safari 동작 확인
  - Playwright로 주요 사용자 플로우 자동화 테스트 권장
- **생성/수정 파일**: 없음 (QA 테스트만)
- **복잡도**: Low
- **의존성**: 5-2 (프로덕션 배포 완료)
- **테스트 계획**:
  - Playwright 자동화:
    - 홈 → 포트폴리오 목록 → 상세 페이지 → 뒤로가기 플로우
    - 카테고리 필터 → 검색 → 결과 확인 플로우
    - 다크모드 토글 → 새로고침 → 모드 유지 확인 플로우
  - 반응형 (Playwright): `browser_resize(375, 812)`, `browser_resize(768, 1024)`, `browser_resize(1280, 800)` 각각 스냅샷
  - Lighthouse CI: 프로덕션 URL에서 자동화된 성능 측정
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

**Phase 5 완료 기준**:
- [ ] Vercel 배포 URL에서 모든 기능 정상 동작
- [ ] Lighthouse 성능/SEO/접근성 점수 각 90점 이상
- [ ] 크로스 브라우저/기기 테스트 통과
- [ ] 분석 도구 연동 및 방문자 통계 수집 확인

---

## 폴더 구조 가이드

```
notion-cms-project/
├── app/
│   ├── layout.tsx                    # Root layout (Providers, Analytics 포함)
│   ├── page.tsx                      # 홈 페이지 (Featured Projects 추가 예정 - Phase 4)
│   ├── not-found.tsx                 # [Phase 3 신규] 404 페이지
│   ├── error.tsx                     # [Phase 3 신규] 전역 에러 페이지
│   ├── sitemap.ts                    # [Phase 4 신규] 동적 Sitemap
│   ├── robots.ts                     # [Phase 4 신규] robots.txt
│   ├── portfolio/
│   │   ├── page.tsx                  # 포트폴리오 목록 [완료]
│   │   ├── error.tsx                 # [Phase 3 신규] 포트폴리오 에러 경계
│   │   └── [id]/
│   │       └── page.tsx              # 프로젝트 상세 [완료]
│   └── api/
│       └── projects/
│           ├── route.ts              # GET /api/projects [완료]
│           └── [id]/
│               └── route.ts          # GET /api/projects/[id] [완료]
├── components/
│   ├── layout/
│   │   ├── navbar.tsx                # [Phase 4 수정] ThemeToggle 추가
│   │   └── footer.tsx                # [완료]
│   ├── providers/
│   │   ├── theme-toggle.tsx          # [완료] Phase 4에서 Navbar 통합
│   │   └── providers.tsx             # [완료]
│   ├── sections/
│   │   ├── hero.tsx                  # [완료]
│   │   ├── features.tsx              # [완료]
│   │   ├── cta.tsx                   # [완료]
│   │   └── featured-projects.tsx     # [Phase 4 신규] 홈 페이지 Featured 섹션
│   └── portfolio/
│       ├── project-card.tsx          # [완료]
│       ├── portfolio-filters.tsx     # [완료]
│       ├── portfolio-list.tsx        # [완료, Phase 3에서 페이지네이션 통합]
│       ├── notion-renderer.tsx       # [완료]
│       ├── load-more-button.tsx      # [Phase 3 신규] "더 보기" 버튼
│       └── index.ts                  # [완료]
├── hooks/
│   ├── use-projects.ts               # [Phase 2 신규] React Query 훅
│   ├── use-project.ts                # [Phase 2 신규] 단일 프로젝트 훅
│   └── index.ts                      # [Phase 2 신규] 배럴 익스포트
├── lib/
│   └── notion/
│       ├── client.ts                 # [완료, Phase 2에서 에러 핸들링 보강]
│       ├── queries.ts                # [완료, Phase 2에서 에러 분기 개선]
│       ├── parser.ts                 # [완료, Phase 2에서 엣지 케이스 보완]
│       └── index.ts                  # [완료]
├── types/
│   ├── notion.ts                     # [완료]
│   └── index.ts                      # [완료]
├── next.config.ts                    # [Phase 1 신규] 이미지 도메인, metadataBase
└── .env.local                        # [Phase 1 신규] 환경 변수 (커밋 금지)
```

---

## 리스크 및 의존성

### 크리티컬 경로 (Critical Path)

```
Phase 1: 환경 설정 (1-1, 1-2, 1-3, 1-4)
  └─> Phase 2: 공통 모듈 (2-1, 2-2, 2-3)
        └─> Phase 3: 핵심 기능 (3-1, 3-2, 3-3, 3-4, 3-5)
              └─> Phase 4: 추가 기능 (4-1, 4-2, 4-3, 4-4)
                    └─> Phase 5: 최적화 & 배포 (5-1, 5-2, 5-3, 5-4)
```

### 기술 리스크

| 리스크 | 심각도 | 발생 가능성 | 대응 전략 |
|--------|--------|-------------|-----------|
| Notion API v5 `dataSources` 인터페이스 변경 | 높음 | 낮음 | `@notionhq/client` 버전 고정 (`package-lock.json`) |
| Notion 이미지 URL 만료 (약 1시간) | 중간 | 높음 | ISR 60초로 주기적 재생성. 만료 시 플레이스홀더 표시 |
| Notion API 레이트 리밋 (3 req/sec) | 중간 | 중간 | ISR 캐싱으로 실제 요청 최소화. 빌드 시 순차 요청 |
| `generateStaticParams` 빌드 실패 | 낮음 | 중간 | `try/catch`로 빈 배열 반환 (이미 구현됨) |
| 검색 기능 성능 (100개+ 프로젝트) | 낮음 | 낮음 | 현재 클라이언트 필터링. 향후 Algolia 등 검색 서비스 고려 |
| Vercel 무료 플랜 빌드 시간 초과 | 낮음 | 낮음 | 정적 생성 페이지 수 모니터링, 필요 시 유료 플랜 |

### 외부 의존성

| 의존성 | 종류 | 영향도 | 비고 |
|--------|------|--------|------|
| Notion API | 필수 | 매우 높음 | 서비스 장애 시 포트폴리오 데이터 조회 불가 |
| `@notionhq/client` | 필수 | 높음 | v5 기준 (dataSources.query API) |
| Vercel | 배포 필수 | 높음 | 대안: AWS Amplify, Netlify |
| next-themes | 선택 | 낮음 | 다크모드 기능 전용 |

### 알려진 제약사항

1. **Notion 텍스트 검색 미지원**: 현재 클라이언트 사이드 필터링. 프로젝트 100개 이상 시 검색 성능 저하 가능
2. **Notion 이미지 URL 만료**: 내부 파일 URL은 약 1시간 후 만료. ISR 60초로 대부분 커버하지만 CDN 엣지 캐시에 남은 URL은 이미지 깨질 수 있음
3. **Notion API 레이트 리밋**: 초당 3회 요청 제한. 빌드 시 `generateStaticParams`에서 다수 호출 시 주의 필요

---

## 기술 스택 참조

| 계층 | 기술 | 버전 | 용도 |
|------|------|------|------|
| Framework | Next.js | 16 | SSR, ISR, App Router, API Routes |
| UI Library | React | 19 | 컴포넌트 기반 UI |
| Language | TypeScript | 최신 | 타입 안전성 |
| Styling | TailwindCSS | v4 | 유틸리티 CSS |
| Component | shadcn/ui | - | 접근성 있는 UI 컴포넌트 |
| CMS | @notionhq/client | v5 | Notion API 연동 (`dataSources.query`) |
| State | Zustand | - | 전역 상태 (필요 시) |
| Cache | @tanstack/react-query | - | 서버 상태 캐싱 (staleTime 60초) |
| Theme | next-themes | - | 다크모드 (attribute="class") |
| Icons | lucide-react | - | 아이콘 |
| Date | date-fns | - | 날짜 포맷팅 (`ko` 로케일) |
| Deploy | Vercel | - | 호스팅 및 CI/CD |

---

## 성공 기준 (PRD 12항 기반)

| 번호 | 완료 조건 | Phase | 상태 |
|------|-----------|-------|------|
| 1 | Notion DB에서 프로젝트 데이터 정상 조회 | Phase 1 | [ ] |
| 2 | 프로젝트 목록 페이지 완성 및 반응형 지원 | Phase 3 | [ ] |
| 3 | 프로젝트 상세 페이지 동작 | Phase 3 | [ ] |
| 4 | 카테고리 필터링 기능 동작 | Phase 3 | [ ] |
| 5 | 검색 기능 구현 | Phase 3 | [ ] |
| 6 | 배포 완료 (Vercel) | Phase 5 | [ ] |
| 7 | 기본 SEO 메타데이터 추가 | Phase 4 | [ ] |

---

## 테스트 전략 요약

### Phase별 주요 테스트

| Phase | 테스트 유형 | 검증 항목 |
|-------|------------|-----------|
| Phase 1 | 환경/설정 | 환경 변수, 이미지 도메인, TypeScript 컴파일 |
| Phase 2 | 단위/통합 | API 에러 처리, 데이터 파싱 엣지 케이스, React Query 훅 |
| Phase 3 | UI/통합 (Playwright) | 목록/상세 페이지 렌더링, 필터/검색 동작, 에러 페이지, 페이지네이션 |
| Phase 4 | UI/SEO (Playwright + Lighthouse) | Featured 섹션, 다크모드, Sitemap, 반응형, 접근성 |
| Phase 5 | 성능/E2E (Playwright + Lighthouse) | Core Web Vitals, 크로스 브라우저, 프로덕션 배포 검증 |

### Playwright MCP 활용 패턴

```
# 기본 UI 검증
browser_navigate → browser_snapshot → 렌더링 상태 확인

# 인터랙션 테스트
browser_navigate → browser_click → browser_snapshot → 결과 확인

# 반응형 테스트
browser_resize(375, 812) → browser_snapshot (모바일)
browser_resize(768, 1024) → browser_snapshot (태블릿)
browser_resize(1280, 800) → browser_snapshot (데스크톱)

# 다크모드 테스트
browser_navigate → ThemeToggle 클릭 → browser_screenshot → 색상 확인

# 네비게이션 플로우
홈 → 포트폴리오 목록 → 프로젝트 카드 클릭 → 상세 페이지 → 뒤로가기
```

---

*최종 업데이트: 2026-03-05*
*문서 작성: Claude Code (PRD-Roadmap-Architect)*
