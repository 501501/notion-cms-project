# Notion CMS + Next.js 패턴 노트

## @notionhq/client v5 API 변경 (2025+)

### databases.query -> dataSources.query
```typescript
// v4 (구버전) - 사용 불가
notion.databases.query({ database_id: "..." })

// v5 (현재) - 올바른 방법
notion.dataSources.query({ data_source_id: "..." })
```

### 타입 임포트 경로
```typescript
import type {
  PageObjectResponse,
  BlockObjectResponse,
  QueryDataSourceParameters,
} from "@notionhq/client/build/src/api-endpoints";
```

## Next.js 16 + @notionhq/client 빌드 주의사항
- `generateStaticParams`에서 Notion API 호출 시 환경 변수 없으면 경고 발생
- try/catch로 감싸서 빌드 실패 방지 필수
- 빌드 경고: `@notionhq/client warn: request fail` → 정상 (env 없을 때)

## Notion 이미지 처리
- 페이지 커버: `page.cover.file.url` 또는 `page.cover.external.url`
- 파일 속성: `props.image.files[0].file.url`
- next.config.ts에 remotePatterns 추가 필수:
  - `prod-files-secure.s3.us-east-1.amazonaws.com`
  - `*.notion.so`

## ISR 전략
- 포트폴리오 목록/상세: `export const revalidate = 60`
- generateStaticParams로 완료 프로젝트 사전 생성
- API 라우트: `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`

## 타입 안전성 팁
- Notion API 응답의 results 배열: `(response.results as any[]).filter(...)`
- 페이지 속성은 `props as Record<string, any>` 패턴 사용 (Notion 속성 타입이 매우 복잡)
