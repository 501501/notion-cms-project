# 프로젝트 규칙 (Development Guidelines)

AI 에이전트를 위한 Notion CMS 포트폴리오 프로젝트 개발 규칙입니다.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | Notion CMS 기반 개인 포트폴리오 웹사이트 |
| **목적** | Notion 데이터베이스를 CMS로 활용한 포트폴리오 사이트 |
| **기술 스택** | Next.js 16, React 19, TypeScript, TailwindCSS v4, shadcn/ui |
| **배포** | Vercel (ISR 60초 기반) |
| **언어** | 한국어 (한글화된 프로젝트) |
| **개발 기간** | 4주 (Phase 1~4, ROADMAP.md 참고) |

---

## 프로젝트 아키텍처

### 폴더 구조 및 책임

| 폴더 | 책임 | 규칙 |
|------|------|------|
| `lib/notion/` | Notion API 통신 계층 | client.ts (싱글톤), queries.ts (조회), parser.ts (파싱) |
| `types/` | TypeScript 타입 정의 | notion.ts (Notion 관련), index.ts (배럴 익스포트) |
| `app/` | 페이지 및 API 라우트 | page.tsx, route.ts, revalidate = 60 필수 |
| `components/portfolio/` | 포트폴리오 관련 컴포넌트 | index.ts 배럴 익스포트 필수 |
| `components/layout/` | 공통 레이아웃 | navbar.tsx, footer.tsx |
| `components/providers/` | Context 제공자 | Providers.tsx 통합 |
| `components/sections/` | 페이지 섹션 | Hero, Features, CTA, FeaturedProjects 등 |

### Notion 데이터 흐름

```
타입 정의 (types/notion.ts)
    ↓
Notion API 클라이언트 (lib/notion/client.ts)
    ↓
쿼리 함수 (lib/notion/queries.ts)
    ↓
데이터 파싱 (lib/notion/parser.ts)
    ↓
API 라우트 또는 페이지에서 사용
    ↓
UI 컴포넌트에 전달 (components/)
```

---

## 코드 표준

### 들여쓰기 및 포맷

- **들여쓰기**: 2칸 (스페이스)
- **라인 길이**: 80자 권장
- **세미콜론**: 필수
- **큰따옴표**: `"` 사용 (작은따옴표 금지)

### 주석 및 커밋 메시지

- **코드 주석**: 한국어 (비즈니스 로직, 주의사항)
- **커밋 메시지**: 한국어 (이모지 + 컨벤셔널 포맷)
- **문서화**: 한국어 (README, 가이드 문서)

### 변수 및 함수명

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수 | camelCase | `projectId`, `isFeatured` |
| 함수 | camelCase | `getProjects()`, `parseProject()` |
| 상수 | UPPER_SNAKE_CASE | `PORTFOLIO_DATABASE_ID` |
| 타입 | PascalCase | `Project`, `ProjectCategory` |
| 컴포넌트 | PascalCase | `ProjectCard`, `PortfolioList` |
| 파일 | kebab-case (컴포넌트는 PascalCase) | `project-card.tsx`, `queries.ts` |

### 배럴 익스포트

**필수 배럴 익스포트 파일:**
- `lib/notion/index.ts` - 모든 Notion 함수 export
- `types/index.ts` - 모든 타입 export
- `components/portfolio/index.ts` - 모든 포트폴리오 컴포넌트 export
- `components/layout/index.ts` - Navbar, Footer export

**배럴 익스포트 예시:**
```typescript
// lib/notion/index.ts
export { notion, PORTFOLIO_DATABASE_ID } from './client';
export { getProjects, getProjectById, ... } from './queries';
export { parseProject, parseBlock, ... } from './parser';
```

---

## Notion 데이터 흐름 규칙

### 타입 정의 (types/notion.ts)

- **필수**: Notion DB 스키마와 정확히 매핑되는 타입 정의
- **예**: `Project`, `ProjectBlock`, `ProjectCategory`, `ProjectStatus`
- **위치**: `types/notion.ts` (중앙화된 타입 관리)
- **추가 규칙**: 새로운 Notion 필드 추가 시 먼저 타입 정의

### 쿼리 함수 (lib/notion/queries.ts)

- **규칙**: 모든 Notion API 호출은 쿼리 함수를 통해서만
- **위치**: `lib/notion/queries.ts`
- **예**: `getProjects()`, `getProjectById()`, `getFeaturedProjects()`
- **필수 요소**:
  - TypeScript 타입 정의 (입력 매개변수, 반환값)
  - 에러 처리 (`try-catch`, 에러 메시지)
  - ISR 지원 (필요 시 `revalidatePath`)

**쿼리 함수 작성 예:**
```typescript
// lib/notion/queries.ts
export async function getProjects(
  category?: ProjectCategory,
  searchQuery?: string
): Promise<Project[]> {
  try {
    const projects = await notion.dataSources.query({
      data_source_id: PORTFOLIO_DATABASE_ID,
      filter: { /* ... */ },
    });
    return projects.results.map(parseProject).filter(/* ... */);
  } catch (error) {
    console.error("프로젝트 조회 실패:", error);
    throw new Error("포트폴리오 데이터를 불러올 수 없습니다.");
  }
}
```

### API 키 보안

- **필수**: `lib/notion/client.ts`에서만 API 키 사용
- **금지**: 클라이언트 컴포넌트(`"use client"`)에서 API 키 사용 금지
- **환경 변수**: `NOTION_API_KEY`, `NOTION_DATABASE_ID`는 `.env.local`에만 저장
- **검증**: 빌드 타임에 환경 변수 존재 여부 확인

---

## 페이지/기능 추가 체크리스트

### 새로운 필터/검색 기능 추가

1. **타입 추가**
   - [ ] `types/notion.ts`에 새로운 타입 정의 (예: `SearchFilter`)

2. **쿼리 함수 추가**
   - [ ] `lib/notion/queries.ts`에 새로운 필터링 로직 구현
   - [ ] 매개변수와 반환값 타입 명시

3. **필터 컴포넌트**
   - [ ] `components/portfolio/portfolio-filters.tsx` 수정
   - [ ] URL 쿼리 파라미터 업데이트 (필터링 상태 동기화)

4. **페이지 수정**
   - [ ] `app/portfolio/page.tsx`에서 새로운 쿼리 파라미터 받기
   - [ ] 쿼리 함수 호출 시 새로운 매개변수 전달

5. **테스트**
   - [ ] Playwright로 UI 상호작용 검증
   - [ ] 실제 Notion 데이터로 필터링 동작 확인

### 새로운 페이지 추가

1. **타입 추가** (필요 시)
   - [ ] `types/notion.ts`에 새 타입 정의

2. **쿼리 함수 추가** (필요 시)
   - [ ] `lib/notion/queries.ts`에 새로운 데이터 조회 함수

3. **API 라우트 추가** (필요 시)
   - [ ] `app/api/[resource]/route.ts` 생성
   - [ ] `lib/notion/index.ts`에서 쿼리 함수 import

4. **페이지 파일 생성**
   - [ ] `app/[name]/page.tsx` 생성
   - [ ] `export const revalidate = 60;` 필수 (ISR)
   - [ ] `export const metadata: Metadata = { ... }` 필수 (SEO)
   - [ ] 서버 컴포넌트로 구현

5. **컴포넌트 추가** (필요 시)
   - [ ] `components/sections/[name].tsx` 또는 `components/[name]/` 폴더 생성
   - [ ] `components/[name]/index.ts` 배럴 익스포트 추가

6. **네비게이션 업데이트**
   - [ ] `components/layout/navbar.tsx`에 새 링크 추가
   - [ ] `components/layout/footer.tsx`에 새 링크 추가 (필요 시)

7. **테스트**
   - [ ] 페이지 렌더링 확인 (npm run dev)
   - [ ] SEO 메타데이터 확인
   - [ ] Playwright로 네비게이션 테스트

---

## 파일 간 의존성

### 동시 수정이 필요한 파일 조합

| 작업 | 수정 파일 (순서) |
|------|-----------------|
| **새 필터 추가** | 1. types/notion.ts → 2. lib/notion/queries.ts → 3. components/portfolio/portfolio-filters.tsx → 4. app/portfolio/page.tsx |
| **새 페이지 추가** | 1. types/notion.ts → 2. lib/notion/queries.ts → 3. app/[name]/page.tsx → 4. components/layout/navbar.tsx |
| **이미지 도메인 추가** | next.config.ts (remotePatterns에 추가) → lib/notion/parser.ts 확인 |
| **메타데이터 템플릿** | app/[name]/page.tsx (generateMetadata 또는 metadata export) |
| **컴포넌트 추가** | 1. components/portfolio/[component].tsx → 2. components/portfolio/index.ts (배럴 익스포트) → 3. 사용처에서 import |

### 전체 의존성 그래프

```
types/notion.ts (모든 모듈의 기초)
├── lib/notion/client.ts (API 클라이언트)
├── lib/notion/queries.ts (데이터 조회)
├── lib/notion/parser.ts (데이터 파싱)
├── app/portfolio/page.tsx (포트폴리오 목록 페이지)
├── app/portfolio/[id]/page.tsx (상세 페이지)
├── components/portfolio/ (포트폴리오 컴포넌트)
├── app/api/projects/route.ts (API 라우트)
└── next.config.ts (이미지 도메인, ISR 설정)
```

---

## 파일 명명 규칙

### Next.js 특수 파일

| 파일명 | 용도 | 규칙 |
|--------|------|------|
| `page.tsx` | 페이지 컴포넌트 | 각 라우트 폴더에 필수 |
| `route.ts` | API 라우트 | 각 API 엔드포인트 폴더에 필수 |
| `layout.tsx` | 레이아웃 | 폴더별 레이아웃 |
| `error.tsx` | 에러 경계 | 폴더별 에러 처리 |
| `not-found.tsx` | 404 페이지 | 루트에 하나 |
| `sitemap.ts` | Sitemap | 루트에 하나 |
| `robots.ts` | robots.txt | 루트에 하나 |

### 컴포넌트 파일명

| 패턴 | 예시 | 규칙 |
|------|------|------|
| 컴포넌트 | `ProjectCard.tsx` | PascalCase, 확장자 .tsx |
| 유틸 함수 | `dateUtils.ts` | camelCase, 확장자 .ts |
| 타입 파일 | `notion.ts` | camelCase, 도메인별 |
| 배럴 익스포트 | `index.ts` | 모든 export를 공개 |

---

## 메타데이터 규칙

### 모든 페이지에 필수 사항

```typescript
// 정적 메타데이터
export const metadata: Metadata = {
  title: "페이지 제목",
  description: "페이지 설명 (120자 이내)",
  openGraph: {
    title: "OG 제목",
    description: "OG 설명",
    type: "website",
  },
};

// ISR 설정
export const revalidate = 60; // 60초마다 재검증
```

### 동적 메타데이터 (생성 함수)

```typescript
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = await getProjectById(params.id);
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      images: [{ url: project.image }],
    },
  };
}
```

### 메타데이터 체크리스트

- [ ] 모든 동적 페이지에 `generateMetadata` 또는 static `metadata` 포함
- [ ] `title`, `description` 필수
- [ ] OG 태그 포함 (소셜 미디어 공유용)
- [ ] OG 이미지 URL은 유효한 절대 경로
- [ ] 모든 페이지 `revalidate = 60` 설정

---

## 성능 최적화 규칙

### 이미지 최적화

- **필수**: `next/image` 컴포넌트 사용 (외부 이미지)
- **도메인 등록**: `next.config.ts`의 `remotePatterns`에 추가
- **예**:
  ```typescript
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.notion.so" },
      { protocol: "https", hostname: "prod-files-secure.s3.us-east-1.amazonaws.com" },
    ],
  }
  ```

### 동적 Import

- **규칙**: 큰 컴포넌트는 동적 import 사용
- **예**:
  ```typescript
  const NotionRenderer = dynamic(() => import('./notion-renderer'), {
    loading: () => <p>로딩 중...</p>,
  });
  ```

### ISR (증분 정적 재생성)

- **규칙**: 모든 동적 페이지에 `export const revalidate = 60;` 필수
- **의미**: 60초마다 페이지 재생성
- **예외**: 정적 페이지 (revalidate 불필요)

### 번들 크기

- **금지**: 불필요한 라이브러리 import
- **권장**: Tree-shaking 가능한 라이브러리 사용
- **측정**: `npm run build` 후 `.next` 폴더 크기 확인

---

## 테스트 규칙

### API 테스트

- **필수**: 새로운 쿼리 함수는 실제 Notion 데이터로 테스트
- **도구**: Node.js REPL 또는 API 라우트로 검증
- **검증 항목**:
  - [ ] 데이터 조회 성공
  - [ ] 에러 처리 (Notion API 오류)
  - [ ] 타입 검증 (반환값이 정의된 타입과 일치)
  - [ ] 필터링/정렬 정상 동작

### UI 컴포넌트 테스트

- **도구**: Playwright MCP 사용
- **검증 항목**:
  - [ ] 페이지 렌더링 (페이지 스냅샷)
  - [ ] 사용자 상호작용 (클릭, 입력, 네비게이션)
  - [ ] 반응형 디자인 (모바일 375px, 태블릿 768px, 데스크톱 1920px)
  - [ ] 다크모드 전환 검증
  - [ ] 스크린샷으로 시각적 회귀 감지

**Playwright 사용 예:**
```bash
# 페이지 스냅샷
browser_snapshot

# UI 클릭 테스트
browser_click(ref="button-id", element="버튼명")

# 폼 입력 테스트
browser_type(ref="input-id", text="검색어")

# 네비게이션 테스트
browser_navigate(url="http://localhost:3000/portfolio")
```

### 통합 테스트

- **규칙**: 페이지 구현 직후 필수
- **흐름**: 데이터 조회 → 렌더링 → 사용자 상호작용
- **도구**: npm run dev + Playwright

---

## 배포 규칙

### 배포 전 체크리스트

- [ ] `npm run build` 성공 (타입 에러 없음)
- [ ] 모든 환경 변수 설정 완료
- [ ] Vercel에 환경 변수 추가 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
- [ ] `next.config.ts` 이미지 도메인 설정 확인
- [ ] SEO 메타데이터 확인 (모든 페이지)
- [ ] Lighthouse 성능 점수 90점 이상 (데스크톱)
- [ ] 모바일 기기에서 반응형 레이아웃 확인
- [ ] 다크모드 전환 정상 동작

### Vercel 배포 설정

| 항목 | 규칙 |
|------|------|
| **프레임워크** | Next.js 16 |
| **빌드 명령어** | `npm run build` |
| **출력 디렉토리** | `.next` (기본값) |
| **환경 변수** | `NOTION_API_KEY`, `NOTION_DATABASE_ID` (서버 환경변수) |
| **ISR** | Vercel에서 자동 지원 (Edge Function 포함) |

---

## 금지 사항

### ❌ 반드시 하지 말아야 할 행동

| 금지 사항 | 이유 | 대안 |
|-----------|------|------|
| 클라이언트 컴포넌트에서 Notion API 키 사용 | 보안 취약점 (키 노출) | `lib/notion/client.ts` (서버 사이드만) |
| "use client"에서 쿼리 함수 직접 호출 | 빌드 에러 (비동기 작업) | API 라우트 또는 서버 컴포넌트 사용 |
| next.config.ts 없이 외부 이미지 추가 | 빌드 실패 | `remotePatterns`에 도메인 등록 |
| ISR 설정 없이 동적 페이지 생성 | 정적 생성 실패 | `export const revalidate = 60;` 필수 |
| 배럴 익스포트 없이 깊은 import | 모듈 구조 복잡성 | `index.ts`로 배럴 익스포트 |
| 타입 정의를 여러 파일에 분산 | 유지보수 어려움 | `types/notion.ts`에 중앙화 |
| 쿼리 함수 없이 페이지에서 직접 API 호출 | 코드 중복, 에러 처리 일관성 부재 | `lib/notion/queries.ts`로 추상화 |
| 메타데이터 없이 페이지 생성 | SEO 점수 저하 | `metadata` 또는 `generateMetadata` 추가 |

---

## 주의사항 & 제약사항

### Notion API 제약

| 제약 | 해결책 |
|------|--------|
| **레이트 리밋**: 3 req/sec | ISR 캐싱으로 요청 최소화, 빌드 시 순차 요청 |
| **이미지 URL 만료**: 1시간 | ISR 60초로 주기적 재생성, CDN 캐시 활용 |
| **텍스트 검색 미지원** | 클라이언트 사이드 필터링 (현재 구현) |

### 성능 고려사항

- **검색 성능**: 프로젝트 100개 이상 시 클라이언트 필터링 성능 저하 가능
- **이미지 최적화**: 외부 이미지는 반드시 `next/image` 사용
- **번들 크기**: 큰 컴포넌트는 동적 import로 분할

### 다국어 지원

- **규칙**: 한국어만 지원 (다국어 미지원)
- **메타데이터**: 한국어로만 작성
- **배포**: `lang="ko"` 설정

### 환경 변수

| 변수명 | 위치 | 보안 |
|--------|------|------|
| `NOTION_API_KEY` | `.env.local` (개발), Vercel (배포) | 🔒 서버 전용 |
| `NOTION_DATABASE_ID` | `.env.local` (개발), Vercel (배포) | 🔒 서버 전용 |

**주의**: `NEXT_PUBLIC_` 접두사 없이 설정 (클라이언트 노출 금지)

---

## 결론

이 규칙을 따르면:
- ✅ 일관된 코드 구조 유지
- ✅ Notion API 안전하게 사용
- ✅ 배포 및 유지보수 용이
- ✅ 팀 협업 효율성 향상

**불명확한 사항은 CLAUDE.md, ROADMAP.md, 실제 코드를 참고하세요.**
