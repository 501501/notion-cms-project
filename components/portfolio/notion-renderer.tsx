/**
 * Notion 블록 콘텐츠 렌더러
 * 상세 페이지에서 Notion 블록을 HTML로 변환하여 표시
 */
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { NotionBlock, NotionRichText } from "@/types/notion";

interface NotionRendererProps {
  blocks: NotionBlock[];
  className?: string;
}

/**
 * RichText 배열을 인라인 HTML로 렌더링
 */
function RichTextRenderer({ richText }: { richText: NotionRichText[] }) {
  if (!richText || richText.length === 0) return null;

  return (
    <>
      {richText.map((rt, i) => {
        let element: React.ReactNode = rt.text;

        if (rt.code) {
          element = (
            <code
              key={i}
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
            >
              {element}
            </code>
          );
        } else {
          const classNames = cn(
            rt.bold && "font-bold",
            rt.italic && "italic",
            rt.strikethrough && "line-through",
            rt.underline && "underline"
          );
          if (rt.href) {
            element = (
              <a
                key={i}
                href={rt.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(classNames, "text-primary hover:underline")}
              >
                {element}
              </a>
            );
          } else if (classNames) {
            element = (
              <span key={i} className={classNames}>
                {element}
              </span>
            );
          }
        }

        return <span key={i}>{element}</span>;
      })}
    </>
  );
}

/**
 * 개별 블록 렌더링
 */
function BlockRenderer({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "heading_1":
      return (
        <h2 className="mb-4 mt-8 text-2xl font-bold">
          <RichTextRenderer richText={block.richText} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="mb-3 mt-6 text-xl font-semibold">
          <RichTextRenderer richText={block.richText} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 className="mb-2 mt-4 text-lg font-semibold">
          <RichTextRenderer richText={block.richText} />
        </h4>
      );
    case "paragraph":
      return (
        <p className="mb-4 leading-relaxed text-foreground/90">
          <RichTextRenderer richText={block.richText} />
        </p>
      );
    case "bulleted_list_item":
      return (
        <li className="mb-1 ml-4 list-disc leading-relaxed">
          <RichTextRenderer richText={block.richText} />
        </li>
      );
    case "numbered_list_item":
      return (
        <li className="mb-1 ml-4 list-decimal leading-relaxed">
          <RichTextRenderer richText={block.richText} />
        </li>
      );
    case "quote":
      return (
        <blockquote className="mb-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
          <RichTextRenderer richText={block.richText} />
        </blockquote>
      );
    case "callout":
      return (
        <div className="mb-4 rounded-lg bg-muted p-4">
          <RichTextRenderer richText={block.richText} />
        </div>
      );
    case "code":
      return (
        <div className="mb-4">
          {block.language && (
            <div className="rounded-t-lg bg-muted/80 px-4 py-1.5 text-xs text-muted-foreground">
              {block.language}
            </div>
          )}
          <pre className={cn(
            "overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm",
            block.language && "rounded-t-none"
          )}>
            <code>
              {block.richText.map((rt) => rt.text).join("")}
            </code>
          </pre>
        </div>
      );
    case "image":
      return block.imageUrl ? (
        <figure className="mb-6">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={block.imageUrl}
              alt={block.imageCaption ?? "이미지"}
              width={800}
              height={450}
              className="w-full object-cover"
            />
          </div>
          {block.imageCaption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.imageCaption}
            </figcaption>
          )}
        </figure>
      ) : null;
    case "divider":
      return <hr className="my-6 border-border" />;
    case "unsupported":
      return null;
    default:
      return null;
  }
}

/**
 * 블록 목록 렌더링 (리스트 아이템은 ul/ol 태그로 그룹화)
 */
export function NotionRenderer({ blocks, className }: NotionRendererProps) {
  const rendered: React.ReactNode[] = [];
  let listBuffer: NotionBlock[] = [];
  let listType: "bulleted" | "numbered" | null = null;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const Tag = listType === "numbered" ? "ol" : "ul";
    rendered.push(
      <Tag key={`list-${rendered.length}`} className="mb-4 space-y-1">
        {listBuffer.map((b) => (
          <BlockRenderer key={b.id} block={b} />
        ))}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  blocks.forEach((block) => {
    const isBulleted = block.type === "bulleted_list_item";
    const isNumbered = block.type === "numbered_list_item";

    if (isBulleted || isNumbered) {
      const currentType = isBulleted ? "bulleted" : "numbered";
      // 다른 타입의 리스트로 전환 시 기존 리스트 flush
      if (listType && listType !== currentType) {
        flushList();
      }
      listType = currentType;
      listBuffer.push(block);
    } else {
      // 리스트 종료
      flushList();
      rendered.push(<BlockRenderer key={block.id} block={block} />);
    }
  });

  // 마지막 리스트 flush
  flushList();

  return (
    <div className={cn("prose-sm max-w-none", className)}>
      {rendered}
    </div>
  );
}
