# 개발 로드맵

**프로젝트**: 개인 포트폴리오 사이트 (Notion CMS 기반)
**총 예상 기간**: 4주 (2026-03-05 ~ 2026-04-02)
**문서 기준일**: 2026-03-05
**참조 문서**: [docs/PRD.md](./docs/PRD.md)

---

## 프로젝트 개요

Notion을 CMS로 활용하는 개인 포트폴리오 웹사이트. Notion 데이터베이스에서 프로젝트 정보를 관리하고, Next.js ISR(증분 정적 재생성)로 자동 반영하는 구조.

**핵심 가치**:
- Notion에서 콘텐츠를 수정하면 웹사이트에 60초 이내 자동 반영
- 코드 수정 없이 포트폴리오 관리 가능
- 현대적 반응형 UI로 전문성 강화

**우선순위**:
1. P0: Notion 연동 + 프로젝트 목록/상세 페이지 + 반응형 디자인
2. P1: 카테고리 필터링 + 검색 기능
3. P2: 다크모드 + SEO 최적화 + 성능 최적화
4. P3: 배포, 운영, 모니터링

---

## 현재 구현 현황 (2026-03-05 기준)

프로젝트 초기 설정이 완료되어 있으며, 핵심 기능의 뼈대가 구현된 상태:

### 완료된 구현

| 항목 | 파일 경로 | 상태 |
|------|-----------|------|
| Notion API 클라이언트 | `lib/notion/client.ts` | 완료 |
| Notion 쿼리 함수 | `lib/notion/queries.ts` | 완료 |
| Notion 데이터 파서 | `lib/notion/parser.ts` | 완료 |
| TypeScript 타입 정의 | `types/notion.ts` | 완료 |
| 포트폴리오 목록 페이지 | `app/portfolio/page.tsx` | 완료 |
| 프로젝트 상세 페이지 | `app/portfolio/[id]/page.tsx` | 완료 |
| API 라우트 (목록) | `app/api/projects/route.ts` | 완료 |
| API 라우트 (상세) | `app/api/projects/[id]/route.ts` | 완료 |
| 프로젝트 카드 컴포넌트 | `components/portfolio/project-card.tsx` | 완료 |
| 필터 & 검색 컴포넌트 | `components/portfolio/portfolio-filters.tsx` | 완료 |
| Notion 블록 렌더러 | `components/portfolio/notion-renderer.tsx` | 완료 |
| 포트폴리오 목록 컴포넌트 | `components/portfolio/portfolio-list.tsx` | 완료 |

### 미완료 항목

| 항목 | 우선순위 | 해당 Phase |
|------|----------|-----------|
| 홈 페이지 Featured 프로젝트 섹션 | P0 | Phase 1 |
| 환경 변수 설정 (.env.local) | P0 | Phase 1 |
| Notion DB 실제 연동 테스트 | P0 | Phase 1 |
| 다크모드 연동 (기존 theme-provider 활용) | P2 | Phase 2 |
| SEO 메타데이터 최적화 | P2 | Phase 2 |
| Sitemap 자동 생성 | P2 | Phase 2 |
| 페이지네이션 UI ("더 보기" 버튼) | P1 | Phase 2 |
| 이미지 도메인 설정 (next.config) | P0 | Phase 1 |
| 에러 페이지 (404, 500) | P1 | Phase 2 |
| About 페이지 | P3 | Phase 3 |
| Vercel 배포 | P0 | Phase 3 |
| 성능 측정 및 최적화 | P2 | Phase 3 |

---

## Phase 1: MVP 완성 - Notion 연동 및 핵심 페이지 안정화

**기간**: 1주 (2026-03-05 ~ 2026-03-11)
**목표**: 실제 Notion DB와 연동하여 포트폴리오 목록/상세 페이지가 정상 동작하는 상태 달성
**팀 구성**: 풀스택 개발자 1명

### 1-1. 환경 설정 및 Notion DB 초기화

- **설명**: Notion API 키와 데이터베이스 ID를 설정하고, PRD 4.1 스키마에 맞는 Notion 데이터베이스를 생성하여 샘플 데이터 입력
- **사용자 스토리**: 개발자로서 로컬 환경에서 Notion 데이터베이스에 연결하여 실제 데이터를 확인하고 싶다
- **수락 기준**:
  - [ ] `.env.local` 파일에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 설정 완료
  - [ ] Notion DB에 PRD 4.1 스키마 필드 모두 생성 (title, category, description, tags, publishedDate, image, content, externalLink, featured, status)
  - [ ] 샘플 프로젝트 3개 이상 입력 (카테고리별 1개씩: 웹, 모바일, 디자인)
  - [ ] `npm run dev` 실행 후 `/portfolio` 에서 실제 데이터 표시 확인
- **기술 고려사항**:
  - Notion 통합(Integration) 설정 후 데이터베이스에 연결 권한 부여 필수
  - `lib/notion/client.ts`에 이미 환경 변수 검증 로직 구현됨
  - `.env.local`은 `.gitignore`에 포함되어 있어야 함 (커밋 금지)
  - Notion API v5 기준: `notion.dataSources.query()` 사용 (기존 `databases.query()` 대체)
- **복잡도**: Low
- **의존성**: 없음
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 1-2. Next.js 이미지 도메인 설정

- **설명**: Notion에서 반환하는 이미지 URL 도메인을 `next.config.ts`에 허용 도메인으로 추가하여 `next/image` 최적화 활성화
- **사용자 스토리**: 방문자로서 포트폴리오 카드에서 프로젝트 썸네일 이미지를 볼 수 있어야 한다
- **수락 기준**:
  - [ ] `next.config.ts`에 Notion 이미지 도메인 설정 (`notion.so`, `s3.us-west-2.amazonaws.com`, `prod-files-secure.s3.us-west-2.amazonaws.com` 등)
  - [ ] 프로젝트 카드에서 썸네일 이미지가 정상 표시
  - [ ] 이미지 없는 프로젝트에서 플레이스홀더 정상 표시
- **기술 고려사항**:
  - Notion 파일 URL은 유효 기간이 있음 (1시간). ISR 60초 설정으로 충분하나 만료 시 이미지 깨짐 가능
  - 외부 이미지 URL (`external` 타입)과 Notion 내부 파일 URL (`file` 타입) 모두 처리
  - `parser.ts`의 `extractCoverUrl()`, `extractFileUrl()` 함수가 이미 양쪽 모두 처리함
  - Next.js 16의 `remotePatterns` 설정 사용 권장 (기존 `domains` deprecated)
- **복잡도**: Low
- **의존성**: 1-1 (환경 설정)
- **참조 파일**: `next.config.ts` (생성 필요)
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 1-3. 홈 페이지 Featured 프로젝트 섹션 구현

- **설명**: 홈 페이지(`app/page.tsx`)에 Notion `featured=true` 프로젝트를 최대 6개 표시하는 섹션 추가. 기존 `Hero`, `Features`, `Cta` 섹션과 통합
- **사용자 스토리**: 채용 담당자로서 홈 페이지에서 가장 중요한 프로젝트를 즉시 확인하고 싶다
- **수락 기준**:
  - [ ] 홈 페이지에 Featured 프로젝트 카드 그리드 섹션 표시
  - [ ] Notion DB에서 `featured=true`이고 `status=완료`인 프로젝트 최대 6개 조회
  - [ ] 각 카드 클릭 시 상세 페이지로 이동
  - [ ] 데이터 없을 때 graceful 처리 (빈 섹션 또는 안내 메시지)
  - [ ] ISR `revalidate = 60` 적용
- **기술 고려사항**:
  - `lib/notion/queries.ts`의 `getFeaturedProjects()` 함수 이미 구현됨
  - `components/portfolio/project-card.tsx` 재사용 가능
  - 서버 컴포넌트로 구현 (데이터 페칭은 서버에서)
  - 홈 페이지 기존 컴포넌트(Hero, Features, Cta)와 시각적 일관성 유지
  - 신규 컴포넌트: `components/sections/featured-projects.tsx` 생성 권장
- **복잡도**: Medium
- **의존성**: 1-1 (Notion 연동), 1-2 (이미지 설정)
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 1-4. Notion API 연동 통합 테스트

- **설명**: 목록 조회, 상세 조회, 필터링, 검색, 페이지네이션 등 전체 데이터 흐름 검증
- **사용자 스토리**: 개발자로서 모든 핵심 기능이 실제 Notion 데이터로 정상 동작하는지 확인하고 싶다
- **수락 기준**:
  - [ ] `/portfolio` 페이지에서 프로젝트 목록 정상 조회 및 표시
  - [ ] `/portfolio?category=웹` 필터링 정상 동작
  - [ ] `/portfolio?search=키워드` 검색 정상 동작 (제목, 설명, 태그 검색)
  - [ ] `/portfolio/[id]` 상세 페이지에서 Notion 블록 콘텐츠 렌더링
  - [ ] API 라우트 `GET /api/projects`, `GET /api/projects/[id]` 정상 응답
  - [ ] 존재하지 않는 ID 접근 시 404 페이지 표시
  - [ ] Notion API 오류 시 에러 메시지 표시 (graceful degradation)
- **기술 고려사항**:
  - Notion API 레이트 리밋: 3 req/sec. 동시 다수 요청 시 429 오류 가능
  - `queries.ts`의 검색은 클라이언트 사이드 필터링 방식 (Notion API 텍스트 검색 미지원)
  - 대량 데이터 시 검색 성능 이슈 가능 - 초기엔 허용 범위
  - ISR 동작 확인: 데이터 수정 후 60초 대기 또는 `next.js` 캐시 무효화 테스트
- **복잡도**: Low
- **의존성**: 1-1, 1-2, 1-3
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

**Phase 1 완료 기준**:
- [ ] 실제 Notion DB 데이터로 홈 페이지, 포트폴리오 목록, 상세 페이지 모두 정상 동작
- [ ] 카테고리 필터 및 검색 기능 동작
- [ ] 이미지 포함 프로젝트에서 썸네일 정상 표시
- [ ] 모바일/태블릿/데스크톱 반응형 레이아웃 확인

---

## Phase 2: 사용성 향상 - UI/UX 개선 및 추가 기능

**기간**: 1주 (2026-03-12 ~ 2026-03-18)
**목표**: 다크모드, SEO 메타데이터, 에러 처리, 페이지네이션 등 사용자 경험 완성
**팀 구성**: 풀스택 개발자 1명
**선행 조건**: Phase 1 완료

### 2-1. 다크모드 연동

- **설명**: 기존 스타터킷의 `next-themes` 기반 `ThemeProvider`와 `ThemeToggle`을 포트폴리오 페이지에 완전 통합. Navbar에 테마 토글 버튼 노출
- **사용자 스토리**: 방문자로서 라이트/다크 모드를 전환하여 편안하게 포트폴리오를 볼 수 있어야 한다
- **수락 기준**:
  - [ ] Navbar에 테마 토글 버튼 표시 (`components/providers/theme-toggle.tsx` 활용)
  - [ ] 라이트/다크/시스템 모드 전환 동작
  - [ ] 포트폴리오 목록, 상세, 홈 페이지 모두 다크모드 적용
  - [ ] 새로고침 후에도 선택한 테마 유지 (localStorage 기반)
  - [ ] 다크모드에서 이미지 플레이스홀더, 카드, 배지 등 모든 UI 요소 가독성 유지
- **기술 고려사항**:
  - `components/providers/theme-provider.tsx`는 이미 `next-themes` 래퍼로 구현됨
  - `globals.css`에 `@custom-variant dark` CSS 변수 이미 설정됨
  - `app/layout.tsx`에 `Providers` 컴포넌트가 이미 `ThemeProvider` 포함
  - Navbar 컴포넌트에 `ThemeToggle` 추가만 필요 (`components/layout/navbar.tsx` 수정)
  - `suppressHydrationWarning`이 `<html>` 태그에 설정되어 있는지 확인
- **복잡도**: Low
- **의존성**: Phase 1 완료
- **참조 파일**: `components/layout/navbar.tsx`, `components/providers/theme-toggle.tsx`
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 2-2. SEO 메타데이터 최적화

- **설명**: 각 페이지의 동적 메타데이터 완성. 구조화된 데이터(Schema.org JSON-LD), OG 태그, Sitemap 자동 생성 구현
- **사용자 스토리**: 검색 엔진이 포트폴리오 사이트를 잘 크롤링하여 검색 결과에 노출되기를 원한다
- **수락 기준**:
  - [ ] 홈 페이지: 사이트 전체 메타데이터 (title, description, OG 태그)
  - [ ] 포트폴리오 목록 페이지: 기본 메타데이터 (이미 `app/portfolio/page.tsx`에 구현됨, 검토)
  - [ ] 프로젝트 상세 페이지: 프로젝트별 동적 메타데이터 (title, description, OG 이미지) - 이미 구현됨, 검토
  - [ ] `app/sitemap.ts` 파일 생성 및 동적 sitemap 생성
  - [ ] `app/robots.ts` 파일 생성
  - [ ] 프로젝트 상세 페이지에 `Article` Schema.org JSON-LD 추가
  - [ ] Lighthouse SEO 점수 90점 이상
- **기술 고려사항**:
  - Next.js 16의 `generateMetadata` API 활용 (이미 상세 페이지에 구현됨)
  - Sitemap은 `getAllProjectIds()`를 활용하여 동적 생성
  - OG 이미지: Notion 이미지 URL 사용 (만료 이슈 있음) 또는 Next.js `og` 이미지 생성 고려
  - `next.config.ts`에 `metadataBase` 설정 필요 (실제 도메인)
  - Schema.org: `ItemList` (포트폴리오 목록), `CreativeWork` (개별 프로젝트) 타입 활용
- **복잡도**: Medium
- **의존성**: Phase 1 완료
- **신규 파일**: `app/sitemap.ts`, `app/robots.ts`
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 2-3. 에러 페이지 및 에러 경계 구현

- **설명**: 404 Not Found 페이지, 500 에러 페이지, Notion API 연결 실패 시 에러 경계(Error Boundary) 구현
- **사용자 스토리**: 방문자로서 존재하지 않는 페이지나 서버 오류 상황에서도 친절한 안내를 받고 싶다
- **수락 기준**:
  - [ ] `app/not-found.tsx` 커스텀 404 페이지 생성 (포트폴리오로 돌아가기 버튼 포함)
  - [ ] `app/error.tsx` 글로벌 에러 페이지 생성
  - [ ] `app/portfolio/error.tsx` 포트폴리오 섹션 에러 경계
  - [ ] Notion API 오류 시 사용자 친화적 메시지 표시 (현재 `portfolio-list.tsx`에 기본 구현됨, 개선)
  - [ ] 모든 에러 페이지에서 홈으로 이동 링크 제공
- **기술 고려사항**:
  - Next.js 16의 파일 기반 에러 처리: `not-found.tsx`, `error.tsx`
  - `error.tsx`는 클라이언트 컴포넌트여야 함 (`"use client"` 필수)
  - `portfolio-list.tsx`의 에러 처리는 이미 구현되어 있으나 UI 개선 여지 있음
  - Notion API 오류 유형 구분: 인증 실패(401), DB 없음(404), 레이트 리밋(429), 서버 오류(500)
- **복잡도**: Low
- **의존성**: Phase 1 완료
- **신규 파일**: `app/not-found.tsx`, `app/error.tsx`, `app/portfolio/error.tsx`
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 2-4. 페이지네이션 UI 구현 ("더 보기" 버튼)

- **설명**: 포트폴리오 목록 페이지에서 12개씩 나누어 로드하는 "더 보기" 버튼 구현. API 레이트 리밋 대응 및 초기 로딩 성능 개선
- **사용자 스토리**: 방문자로서 많은 프로젝트가 있을 때 "더 보기" 버튼으로 추가 프로젝트를 불러올 수 있어야 한다
- **수락 기준**:
  - [ ] 포트폴리오 목록에서 기본 12개 표시
  - [ ] 추가 프로젝트 있을 때 "더 보기" 버튼 표시
  - [ ] "더 보기" 클릭 시 다음 12개 추가 로드 (기존 목록에 append)
  - [ ] 마지막 페이지에서 "더 보기" 버튼 숨김
  - [ ] 로딩 중 스피너 또는 스켈레톤 표시
- **기술 고려사항**:
  - `queries.ts`의 `getProjects()`는 이미 `pageSize`, `startCursor`, `hasMore` 지원
  - API 라우트 `GET /api/projects?cursor=...`로 클라이언트에서 호출
  - Zustand 또는 React Query 무한 스크롤 패턴 활용 가능
  - 현재 `PortfolioList`는 서버 컴포넌트 - 클라이언트 컴포넌트로 분리 또는 혼합 필요
  - 검색/필터 변경 시 페이지네이션 초기화 처리 필요
  - 대안: URL 기반 페이지네이션 (`?page=2`) - 더 단순하고 URL 공유 가능
- **복잡도**: Medium
- **의존성**: Phase 1 완료
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

**Phase 2 완료 기준**:
- [ ] 다크모드 모든 페이지에서 정상 동작
- [ ] SEO 메타데이터 모든 페이지 적용, Sitemap 생성 확인
- [ ] 404 및 에러 페이지 정상 표시
- [ ] 페이지네이션 동작 확인

---

## Phase 3: 최적화 및 배포

**기간**: 1주 (2026-03-19 ~ 2026-03-25)
**목표**: 성능 최적화, About 페이지 추가, Vercel 배포 완료
**팀 구성**: 풀스택 개발자 1명
**선행 조건**: Phase 2 완료

### 3-1. About 페이지 구현

- **설명**: 개발자 프로필, 기술 스택, 연락처 정보를 담은 About 페이지 구현. Notion에서 콘텐츠 관리 가능하도록 설계
- **사용자 스토리**: 채용 담당자로서 개발자의 배경, 기술, 연락처를 한 눈에 확인하고 싶다
- **수락 기준**:
  - [ ] `/about` 라우트 생성
  - [ ] 개발자 소개, 기술 스택, 연락처 섹션 포함
  - [ ] Navbar에 About 링크 추가
  - [ ] 반응형 레이아웃 적용
  - [ ] 다크모드 지원
- **기술 고려사항**:
  - 콘텐츠 관리 방식 결정 필요: Notion 연동 vs 정적 컴포넌트
  - Notion 연동 선택 시: 별도 About 페이지 Notion DB 또는 단일 페이지 블록 조회
  - shadcn/ui `Avatar`, `Badge`, `Card` 컴포넌트 활용
  - 이미 `components/ui/avatar.tsx` 존재함
- **복잡도**: Medium
- **의존성**: Phase 1, Phase 2 완료
- **신규 파일**: `app/about/page.tsx`, `components/sections/about-hero.tsx`
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 3-2. 성능 최적화

- **설명**: Lighthouse 성능 점수 개선, 번들 크기 최적화, 이미지 최적화 확인
- **사용자 스토리**: 방문자로서 사이트가 빠르게 로드되어 쾌적하게 포트폴리오를 탐색하고 싶다
- **수락 기준**:
  - [ ] Lighthouse 성능 점수 90점 이상 (모바일 기준 80점 이상)
  - [ ] Core Web Vitals 통과 (LCP < 2.5s, CLS < 0.1, FID < 100ms)
  - [ ] 동적 import 적용 (필요한 컴포넌트)
  - [ ] `next/image`의 `priority` prop 최상단 이미지에 적용 확인
  - [ ] 불필요한 클라이언트 번들 최소화
- **기술 고려사항**:
  - `app/portfolio/[id]/page.tsx`의 히어로 이미지에 `priority` 이미 적용됨
  - `npm run build` 후 번들 분석: `@next/bundle-analyzer` 사용 가능
  - ISR `revalidate = 60`이 모든 동적 페이지에 설정되어 있는지 확인
  - Notion API 응답 캐싱: HTTP 헤더 `Cache-Control` 이미 API 라우트에 적용됨
  - 폰트 최적화: `next/font`로 Geist 로컬 폰트 사전 로드 확인
- **복잡도**: Medium
- **의존성**: Phase 2 완료
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 3-3. Vercel 배포 및 환경 변수 설정

- **설명**: Vercel에 프로젝트 배포, 프로덕션 환경 변수 설정, 커스텀 도메인 연결
- **사용자 스토리**: 개발자로서 포트폴리오 사이트를 실제 인터넷에서 접근 가능하도록 배포하고 싶다
- **수락 기준**:
  - [ ] Vercel 프로젝트 생성 및 GitHub 레포지토리 연결
  - [ ] Vercel 대시보드에서 환경 변수 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
  - [ ] 프로덕션 빌드 성공 (`npm run build` 오류 없음)
  - [ ] 배포된 URL에서 모든 페이지 정상 동작 확인
  - [ ] 커스텀 도메인 연결 (선택 사항)
  - [ ] `next.config.ts`의 `metadataBase`를 프로덕션 도메인으로 설정
- **기술 고려사항**:
  - Notion API 키는 Vercel 환경 변수에 서버 전용으로 설정 (클라이언트 노출 금지)
  - `NEXT_PUBLIC_` 접두사 없이 환경 변수 설정 필요
  - Vercel 무료 플랜: ISR 재검증 동작 확인 (Edge Function 포함)
  - Next.js 빌드 시 `generateStaticParams` 실행으로 Notion API 호출됨 - 빌드 환경에서도 API 키 필요
  - `next.config.ts`에 Notion 이미지 도메인 `remotePatterns` 설정 확인
- **복잡도**: Low
- **의존성**: Phase 2 완료, 도메인 구매 (선택)
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 3-4. 최종 QA 및 크로스 브라우저 테스트

- **설명**: 주요 브라우저(Chrome, Safari, Firefox)와 기기(모바일, 태블릿, 데스크톱)에서 전체 기능 검증
- **사용자 스토리**: 개발자로서 다양한 환경의 방문자 모두에게 일관된 경험을 제공하고 싶다
- **수락 기준**:
  - [ ] Chrome, Safari, Firefox 최신 버전에서 정상 동작
  - [ ] 모바일(375px), 태블릿(768px), 데스크톱(1280px) 레이아웃 확인
  - [ ] 다크모드/라이트모드 모든 브라우저에서 정상 동작
  - [ ] 모든 링크 및 버튼 동작 확인
  - [ ] 키보드 네비게이션 접근성 확인 (Tab, Enter, Esc)
  - [ ] 이미지 alt 텍스트 확인 (스크린 리더 대응)
- **기술 고려사항**:
  - shadcn/ui + Radix UI는 기본적으로 접근성(WAI-ARIA) 준수
  - iOS Safari의 CSS 호환성 주의 (특히 `backdrop-filter`, CSS 그리드)
  - `components/portfolio/portfolio-filters.tsx`의 URL 전환 시 Safari 동작 확인
- **복잡도**: Low
- **의존성**: 3-3 (배포 완료)
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

**Phase 3 완료 기준**:
- [ ] Vercel 배포 URL에서 모든 기능 정상 동작
- [ ] Lighthouse 성능/SEO/접근성 점수 각 90점 이상
- [ ] 크로스 브라우저/기기 테스트 통과
- [ ] 프로덕션 환경 변수 설정 완료

---

## Phase 4: 운영 및 개선 (지속)

**기간**: 2026-03-26 이후 (지속)
**목표**: 모니터링 설정, 콘텐츠 추가, 피드백 기반 개선
**팀 구성**: 풀스택 개발자 1명 (파트타임)

### 4-1. 분석 도구 연동

- **설명**: Google Analytics 4 또는 Vercel Analytics 연동으로 방문자 통계 수집
- **수락 기준**:
  - [ ] 페이지뷰, 이벤트 추적 설정
  - [ ] 어떤 프로젝트가 가장 많이 조회되는지 확인 가능
- **복잡도**: Low
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 4-2. 에러 모니터링 (선택)

- **설명**: Sentry 연동으로 프로덕션 에러 실시간 추적
- **수락 기준**:
  - [ ] 클라이언트/서버 에러 모두 Sentry 대시보드에서 확인 가능
  - [ ] Notion API 오류 알림 설정
- **복잡도**: Low
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

### 4-3. 콘텐츠 보강 및 지속적 업데이트

- **설명**: Notion에서 새 프로젝트 추가, 기존 프로젝트 내용 보강
- **수락 기준**:
  - [ ] 실제 프로젝트 5개 이상 등록 (완성도 있는 설명, 이미지 포함)
  - [ ] Featured 프로젝트 2-4개 선정
- **복잡도**: Low (기술 작업 최소)
- **상태**: [ ] 예정 [ ] 진행중 [ ] 완료

---

## 리스크 및 의존성

### 크리티컬 경로 (Critical Path)

```
환경 설정 (1-1)
  └─> 이미지 도메인 설정 (1-2)
  └─> Featured 섹션 구현 (1-3)
  └─> 통합 테스트 (1-4)
          └─> 다크모드 (2-1)
          └─> SEO 최적화 (2-2)
          └─> 에러 페이지 (2-3)
          └─> 페이지네이션 (2-4)
                  └─> About 페이지 (3-1)
                  └─> 성능 최적화 (3-2)
                  └─> Vercel 배포 (3-3)
                          └─> QA 테스트 (3-4)
```

### 기술 리스크

| 리스크 | 심각도 | 발생 가능성 | 대응 전략 |
|--------|--------|-------------|-----------|
| Notion API v5 `dataSources` 인터페이스 변경 | 높음 | 낮음 | `@notionhq/client` 버전 고정 (`package-lock.json` 확인) |
| Notion 이미지 URL 만료 (1시간) | 중간 | 높음 | ISR 60초로 주기적 재생성. 만료 시 플레이스홀더 표시 |
| Notion API 레이트 리밋 (3 req/sec) | 중간 | 중간 | ISR 캐싱으로 실제 요청 최소화. 빌드 시 순차 요청 |
| `generateStaticParams` 빌드 실패 | 낮음 | 중간 | `try/catch`로 빈 배열 반환 (이미 구현됨) |
| Vercel 무료 플랜 빌드 시간 초과 | 낮음 | 낮음 | 정적 생성 페이지 수 모니터링, 필요 시 유료 플랜 |

### 외부 의존성

| 의존성 | 종류 | 영향도 | 비고 |
|--------|------|--------|------|
| Notion API | 필수 | 매우 높음 | 서비스 장애 시 포트폴리오 동작 불가 |
| Vercel | 필수 (배포) | 높음 | 대안: AWS, Netlify |
| @notionhq/client | 필수 | 높음 | `npm list @notionhq/client`로 버전 확인 |
| next-themes | 선택 | 낮음 | 다크모드 기능 전용 |

### 알려진 제약사항

1. **Notion 텍스트 검색 미지원**: 현재 구현은 클라이언트 사이드 필터링 방식. 프로젝트 수가 많아지면 (100개+) 검색 성능 저하 가능
2. **이미지 URL 만료**: Notion 내부 파일 URL은 약 1시간 후 만료. ISR 60초로 대부분 커버하지만 CDN 엣지 캐시에 남은 오래된 URL은 이미지 깨질 수 있음
3. **API 레이트 리밋**: Notion API는 초당 3회 요청 제한. 빌드 시 `generateStaticParams`에서 다수 호출 시 주의 필요

---

## 폴더 구조 가이드

```
notion-cms-project/
├── app/
│   ├── layout.tsx                    # Root layout (Providers 포함)
│   ├── page.tsx                      # 홈 페이지 (Featured Projects 추가 필요)
│   ├── not-found.tsx                 # [신규] 404 페이지
│   ├── error.tsx                     # [신규] 글로벌 에러 페이지
│   ├── sitemap.ts                    # [신규] 동적 Sitemap
│   ├── robots.ts                     # [신규] robots.txt
│   ├── about/
│   │   └── page.tsx                  # [신규] About 페이지
│   ├── portfolio/
│   │   ├── page.tsx                  # 포트폴리오 목록 [완료]
│   │   ├── error.tsx                 # [신규] 포트폴리오 에러 경계
│   │   └── [id]/
│   │       └── page.tsx              # 프로젝트 상세 [완료]
│   └── api/
│       └── projects/
│           ├── route.ts              # GET /api/projects [완료]
│           └── [id]/
│               └── route.ts          # GET /api/projects/[id] [완료]
├── components/
│   ├── layout/
│   │   ├── navbar.tsx                # [수정 필요] ThemeToggle 추가
│   │   └── footer.tsx                # [완료]
│   ├── providers/
│   │   ├── theme-toggle.tsx          # [완료] Navbar에 통합 예정
│   │   └── providers.tsx             # [완료]
│   ├── sections/
│   │   ├── hero.tsx                  # [완료]
│   │   ├── features.tsx              # [완료]
│   │   ├── cta.tsx                   # [완료]
│   │   ├── featured-projects.tsx     # [신규] 홈 페이지용
│   │   └── about-hero.tsx            # [신규] About 페이지용
│   └── portfolio/
│       ├── project-card.tsx          # [완료]
│       ├── portfolio-filters.tsx     # [완료]
│       ├── portfolio-list.tsx        # [완료]
│       ├── notion-renderer.tsx       # [완료]
│       └── index.ts                  # [완료]
├── lib/
│   └── notion/
│       ├── client.ts                 # [완료]
│       ├── queries.ts                # [완료]
│       ├── parser.ts                 # [완료]
│       └── index.ts                  # [완료]
├── types/
│   ├── notion.ts                     # [완료]
│   └── index.ts                      # [완료]
├── next.config.ts                    # [수정 필요] 이미지 도메인 추가
└── .env.local                        # [생성 필요] 환경 변수
```

---

## 기술 스택 참조

| 계층 | 기술 | 버전 | 용도 |
|------|------|------|------|
| Framework | Next.js | 16 | SSR, ISR, API Routes |
| UI Library | React | 19 | 컴포넌트 기반 UI |
| Language | TypeScript | 최신 | 타입 안전성 |
| Styling | TailwindCSS | v4 | 유틸리티 CSS |
| Component | shadcn/ui | - | 접근성 있는 UI 컴포넌트 |
| CMS | @notionhq/client | v5 | Notion API 연동 |
| State | Zustand | - | 전역 상태 (필요 시) |
| Cache | @tanstack/react-query | - | 서버 상태 캐싱 |
| Theme | next-themes | - | 다크모드 |
| Icons | lucide-react | - | 아이콘 |
| Date | date-fns | - | 날짜 포맷팅 |
| Deploy | Vercel | - | 호스팅 및 CI/CD |

---

## 성공 기준 (PRD 12항 기반)

| 번호 | 완료 조건 | Phase | 상태 |
|------|-----------|-------|------|
| 1 | Notion DB에서 프로젝트 데이터 정상 조회 | Phase 1 | [ ] |
| 2 | 프로젝트 목록 페이지 완성 및 반응형 지원 | Phase 1 | [ ] |
| 3 | 프로젝트 상세 페이지 동작 | Phase 1 | [ ] |
| 4 | 카테고리 필터링 기능 동작 | Phase 1 | [ ] |
| 5 | 검색 기능 구현 | Phase 1 | [ ] |
| 6 | 배포 완료 (Vercel) | Phase 3 | [ ] |
| 7 | 기본 SEO 메타데이터 추가 | Phase 2 | [ ] |

---

*최종 업데이트: 2026-03-05*
*문서 작성: Claude Code (PRD-Roadmap-Architect)*
