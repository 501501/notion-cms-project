/**
 * Notion API 응답 파서
 * Notion 원시 데이터를 정규화된 타입으로 변환
 */
import type {
  PageObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type {
  ProjectSummary,
  ProjectCategory,
  ProjectStatus,
  NotionBlock,
  NotionRichText,
  NotionBlockType,
} from "@/types/notion";

/**
 * Notion RichText 배열에서 평문 텍스트 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractPlainText(richText: any[]): string {
  if (!Array.isArray(richText)) return "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return richText.map((t: any) => t.plain_text ?? "").join("");
}

/**
 * Notion RichText 배열을 정규화된 형태로 변환
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseRichText(richTextArr: any[]): NotionRichText[] {
  if (!Array.isArray(richTextArr)) return [];
  return richTextArr.map((rt) => ({
    type: rt.type ?? "text",
    text: rt.plain_text ?? "",
    href: rt.href ?? null,
    bold: rt.annotations?.bold ?? false,
    italic: rt.annotations?.italic ?? false,
    strikethrough: rt.annotations?.strikethrough ?? false,
    underline: rt.annotations?.underline ?? false,
    code: rt.annotations?.code ?? false,
    color: rt.annotations?.color ?? "default",
  }));
}

/**
 * Notion 페이지 속성에서 파일/이미지 URL 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFileUrl(fileProp: any): string | null {
  if (!fileProp) return null;
  const files = fileProp.files;
  if (!Array.isArray(files) || files.length === 0) return null;
  const first = files[0];
  if (first.type === "file") return first.file.url;
  if (first.type === "external") return first.external.url;
  return null;
}

/**
 * Notion 페이지 커버 이미지 URL 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractCoverUrl(page: any): string | null {
  if (!page.cover) return null;
  if (page.cover.type === "file") return page.cover.file.url;
  if (page.cover.type === "external") return page.cover.external.url;
  return null;
}

/**
 * Notion 페이지를 ProjectSummary 타입으로 변환
 */
export function parseProjectPage(page: PageObjectResponse): ProjectSummary {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = page.properties as Record<string, any>;

  // 제목 추출
  const title =
    props.title?.title
      ?.map((t: { plain_text: string }) => t.plain_text)
      .join("") ??
    props.Name?.title
      ?.map((t: { plain_text: string }) => t.plain_text)
      .join("") ??
    "제목 없음";

  // 설명 추출
  const description =
    props.description?.rich_text
      ?.map((t: { plain_text: string }) => t.plain_text)
      .join("") ?? "";

  // 카테고리
  const category = (props.category?.select?.name ?? "기타") as ProjectCategory;

  // 상태
  const status = (props.status?.select?.name ?? "완료") as ProjectStatus;

  // 태그 (Multi-select)
  const tags: string[] =
    props.tags?.multi_select?.map((t: { name: string }) => t.name) ?? [];

  // 발행일
  const publishedDate = props.publishedDate?.date?.start ?? null;

  // 이미지: 페이지 커버 우선, 없으면 image 필드
  const imageUrl = extractCoverUrl(page) ?? extractFileUrl(props.image);

  // 외부 링크
  const externalLink = props.externalLink?.url ?? null;

  // 홈 노출 여부
  const featured = props.featured?.checkbox ?? false;

  return {
    id: page.id,
    title,
    description,
    category,
    status,
    tags,
    publishedDate,
    imageUrl,
    externalLink,
    featured,
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  };
}

/**
 * Notion 블록을 정규화된 NotionBlock 타입으로 변환
 */
export function parseBlock(block: BlockObjectResponse): NotionBlock {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b = block as any;
  const type = block.type as NotionBlockType;

  // 기본 구조
  const parsed: NotionBlock = {
    id: block.id,
    type,
    richText: [],
  };

  // 블록 타입별 richText 및 추가 데이터 파싱
  switch (type) {
    case "paragraph":
      parsed.richText = parseRichText(b.paragraph?.rich_text ?? []);
      break;
    case "heading_1":
      parsed.richText = parseRichText(b.heading_1?.rich_text ?? []);
      break;
    case "heading_2":
      parsed.richText = parseRichText(b.heading_2?.rich_text ?? []);
      break;
    case "heading_3":
      parsed.richText = parseRichText(b.heading_3?.rich_text ?? []);
      break;
    case "bulleted_list_item":
      parsed.richText = parseRichText(b.bulleted_list_item?.rich_text ?? []);
      break;
    case "numbered_list_item":
      parsed.richText = parseRichText(b.numbered_list_item?.rich_text ?? []);
      break;
    case "quote":
      parsed.richText = parseRichText(b.quote?.rich_text ?? []);
      break;
    case "callout":
      parsed.richText = parseRichText(b.callout?.rich_text ?? []);
      break;
    case "code":
      parsed.richText = parseRichText(b.code?.rich_text ?? []);
      parsed.language = b.code?.language ?? "plain text";
      break;
    case "image": {
      const img = b.image;
      if (img?.type === "file") parsed.imageUrl = img.file.url;
      else if (img?.type === "external") parsed.imageUrl = img.external.url;
      parsed.imageCaption =
        img?.caption
          ?.map((t: { plain_text: string }) => t.plain_text)
          .join("") ?? "";
      break;
    }
    case "divider":
      // 별도 콘텐츠 없음
      break;
    default:
      parsed.type = "unsupported";
  }

  return parsed;
}
