/**
 * Notion API 쿼리 함수
 * 포트폴리오 데이터 조회 로직 (서버 사이드 전용)
 *
 * @notionhq/client v5 기준:
 *   databases.query → datasources.query (data_source_id)
 */
import type {
  QueryDataSourceParameters,
  PageObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { notion, PORTFOLIO_DATABASE_ID } from "./client";
import { parseProjectPage, parseBlock } from "./parser";
import type {
  ProjectSummary,
  Project,
  ProjectQueryParams,
  PaginatedProjects,
} from "@/types/notion";

/**
 * 포트폴리오 프로젝트 목록 조회
 * 카테고리 필터링, 검색, 페이지네이션 지원
 */
export async function getProjects(
  params: ProjectQueryParams = {},
): Promise<PaginatedProjects> {
  const {
    category,
    status = "완료",
    featured,
    pageSize = 12,
    startCursor,
  } = params;

  // 필터 조건 구성
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any[] = [];

  // 상태 필터 (기본: 완료된 프로젝트만)
  if (status) {
    filters.push({
      property: "status",
      select: { equals: status },
    });
  }

  // 카테고리 필터
  if (category) {
    filters.push({
      property: "category",
      select: { equals: category },
    });
  }

  // 홈 노출 필터
  if (featured !== undefined) {
    filters.push({
      property: "featured",
      checkbox: { equals: featured },
    });
  }

  const queryParams: QueryDataSourceParameters = {
    data_source_id: PORTFOLIO_DATABASE_ID,
    page_size: pageSize,
    sorts: [
      {
        property: "publishedDate",
        direction: "descending",
      },
    ],
  };

  // 필터 적용 (복합 필터는 and 조건)
  if (filters.length === 1) {
    queryParams.filter = filters[0];
  } else if (filters.length > 1) {
    queryParams.filter = { and: filters };
  }

  // 페이지네이션 커서
  if (startCursor) {
    queryParams.start_cursor = startCursor;
  }

  const response = await notion.dataSources.query(queryParams);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let projects: ProjectSummary[] = (response.results as any[])
    .filter(
      (p): p is PageObjectResponse => p.object === "page" && "properties" in p,
    )
    .map(parseProjectPage);

  // 클라이언트 사이드 검색 필터링 (Notion API는 텍스트 검색 미지원)
  if (params.search) {
    const query = params.search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)),
    );
  }

  return {
    projects,
    nextCursor: response.next_cursor,
    hasMore: response.has_more,
  };
}

/**
 * 특정 프로젝트 상세 정보 조회 (블록 콘텐츠 포함)
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    // 페이지 메타데이터 조회
    const page = await notion.pages.retrieve({ page_id: id });

    if (page.object !== "page" || !("properties" in page)) {
      return null;
    }

    const summary = parseProjectPage(page as PageObjectResponse);

    // 페이지 블록(콘텐츠) 조회
    const blocksResponse = await notion.blocks.children.list({
      block_id: id,
      page_size: 100,
    });

    const content = blocksResponse.results
      .filter(
        (b): b is BlockObjectResponse => b.object === "block" && "type" in b,
      )
      .map(parseBlock);

    return {
      ...summary,
      content,
    };
  } catch (error) {
    console.error(`프로젝트 조회 실패 (id: ${id}):`, error);
    return null;
  }
}

/**
 * 홈페이지용 주요 프로젝트 조회 (최대 6개)
 */
export async function getFeaturedProjects(): Promise<ProjectSummary[]> {
  const result = await getProjects({
    featured: true,
    status: "완료",
    pageSize: 6,
  });
  return result.projects;
}

/**
 * 모든 프로젝트 ID 목록 조회 (SSG용 - generateStaticParams)
 */
export async function getAllProjectIds(): Promise<string[]> {
  const ids: string[] = [];
  let cursor: string | undefined;

  // 페이지네이션으로 전체 조회
  while (true) {
    const response = await notion.dataSources.query({
      data_source_id: PORTFOLIO_DATABASE_ID,
      page_size: 100,
      start_cursor: cursor,
      filter: {
        property: "status",
        select: { equals: "완료" },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageIds = (response.results as any[])
      .filter((p): p is PageObjectResponse => p.object === "page")
      .map((p: PageObjectResponse) => p.id);

    ids.push(...pageIds);

    if (!response.has_more) break;
    cursor = response.next_cursor ?? undefined;
  }

  return ids;
}
