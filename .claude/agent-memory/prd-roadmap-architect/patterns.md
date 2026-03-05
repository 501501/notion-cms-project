# 로드맵 아키텍처 패턴

## PRD 분석 워크플로우

1. PRD 전체 읽기
2. 기존 구현 파일 병렬 탐색 (Glob으로 구조 파악 후 Read로 핵심 파일 확인)
3. 완료/미완료 매트릭스 작성
4. Phase별 우선순위 할당 (P0 → MVP, P1 → 기능 강화, P2 → 최적화)

## Notion CMS 프로젝트 특유의 리스크

| 리스크 | 대응 |
|--------|------|
| API v5 인터페이스 변경 | 버전 고정 + 공식 문서 확인 |
| 이미지 URL 만료 | ISR 짧은 주기 + 플레이스홀더 fallback |
| 레이트 리밋 | ISR 캐싱으로 실제 API 호출 최소화 |
| 빌드 시 API 호출 실패 | generateStaticParams의 try/catch + 빈 배열 반환 |

## Next.js 16 + Notion 최적 아키텍처

- 데이터 페칭: 서버 컴포넌트 + ISR (React Query는 클라이언트에서만)
- 검색/필터: URL 쿼리 파라미터 기반 (공유 가능 + SSR 친화적)
- 이미지: next/image + remotePatterns (domains deprecated)
- 에러 처리: not-found.tsx, error.tsx 파일 기반 라우팅

## 복잡도 추정 기준

- **Low**: 설정 파일 수정, 기존 컴포넌트 재사용, 단순 페이지 생성
- **Medium**: 새 컴포넌트 설계, API 연동, 상태 관리 포함
- **High**: 아키텍처 변경, 외부 서비스 연동, 복잡한 상태 로직

## 현황 분석 → 로드맵 반영 원칙

- 이미 구현된 기능은 "완료"로 표기하되 "검토" 항목을 수락 기준에 포함
- 뼈대만 있고 실제 동작 미확인인 경우 Phase 1에 통합 테스트 태스크 배치
- 환경 설정(API 키, 도메인 등)은 항상 Phase 1 최우선 태스크
