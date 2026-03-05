# Next.js Init Optimizer - 프로젝트 메모리

## 프로젝트 정보
- **프로젝트명**: notion-cms-portfolio (Notion CMS 기반 개인 포트폴리오)
- **스택**: Next.js 16, React 19, TypeScript, TailwindCSS v4, shadcn/ui, @notionhq/client v5

## @notionhq/client v5 주요 변경사항 (중요)
- `databases.query` -> `dataSources.query` (camelCase, data_source_id 파라미터)
- `QueryDatabaseParameters` -> `QueryDataSourceParameters`
- `database_id` -> `data_source_id`
- 타입 경로: `@notionhq/client/build/src/api-endpoints`
- 상세: [patterns.md](./patterns.md)

## 프로젝트 구조
```
lib/notion/       - Notion API 클라이언트, 파서, 쿼리 함수
types/            - 공유 타입 정의 (notion.ts, index.ts)
app/portfolio/    - 포트폴리오 목록 페이지 (ISR 60s)
app/portfolio/[id]/ - 프로젝트 상세 페이지 (SSG + ISR)
app/api/projects/ - REST API 라우트
components/portfolio/ - 포트폴리오 컴포넌트 모음
```

## 패키지 분류 원칙
- `next-themes`, `zustand`, `react-hook-form`, `sonner`, `date-fns`, `@tanstack/react-query` → `dependencies` (런타임 사용)
- `@tanstack/react-query-devtools`, 타입 패키지 → `devDependencies`

## 환경 변수
- `.env.local.example` 참고 (NOTION_API_KEY, NOTION_DATABASE_ID 필수)
- `.gitignore`에 `.env*` 이미 포함됨
