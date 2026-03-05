/**
 * Notion CMS 포트폴리오 타입 정의
 * PRD 4.1 프로젝트 데이터베이스 스키마 기반
 */

// 프로젝트 카테고리
export type ProjectCategory = "웹" | "모바일" | "디자인" | "기타";

// 프로젝트 상태
export type ProjectStatus = "진행중" | "완료" | "보관";

// 프로젝트 외부 링크
export interface ProjectLink {
  label: string;
  url: string;
}

/**
 * 파싱된 포트폴리오 프로젝트 데이터
 * Notion API 응답에서 추출하여 정규화된 구조
 */
export interface Project {
  // 고유 식별자 (Notion 페이지 ID)
  id: string;

  // 기본 정보
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;

  // 메타 정보
  tags: string[];
  publishedDate: string | null;

  // 미디어
  imageUrl: string | null;

  // 링크
  externalLink: string | null;

  // 홈 노출 여부
  featured: boolean;

  // 상세 페이지용 콘텐츠 (Notion 블록)
  content?: NotionBlock[];

  // Notion 페이지 메타
  createdAt: string;
  updatedAt: string;
}

/**
 * 포트폴리오 목록 페이지용 간략화된 프로젝트 타입
 * 상세 콘텐츠 제외
 */
export type ProjectSummary = Omit<Project, "content">;

/**
 * Notion 블록 타입 (상세 페이지 렌더링용)
 */
export type NotionBlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list_item"
  | "numbered_list_item"
  | "code"
  | "image"
  | "divider"
  | "quote"
  | "callout"
  | "toggle"
  | "unsupported";

export interface NotionRichText {
  type: "text" | "mention" | "equation";
  text: string;
  href: string | null;
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface NotionBlock {
  id: string;
  type: NotionBlockType;
  richText: NotionRichText[];
  // 코드 블록 언어
  language?: string;
  // 이미지 URL
  imageUrl?: string;
  imageCaption?: string;
  // 중첩 블록
  children?: NotionBlock[];
}

/**
 * Notion 데이터베이스 쿼리 파라미터
 */
export interface ProjectQueryParams {
  category?: ProjectCategory;
  status?: ProjectStatus;
  featured?: boolean;
  search?: string;
  pageSize?: number;
  startCursor?: string;
}

/**
 * 페이지네이션 결과
 */
export interface PaginatedProjects {
  projects: ProjectSummary[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}

/**
 * API 라우트 응답 타입
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
}
