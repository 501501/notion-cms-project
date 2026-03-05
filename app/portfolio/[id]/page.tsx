/**
 * 프로젝트 상세 페이지 (/portfolio/[id])
 * Notion 페이지 블록을 렌더링하는 동적 페이지
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NotionRenderer } from "@/components/portfolio/notion-renderer";
import { getProjectById, getAllProjectIds } from "@/lib/notion";

// ISR: 60초마다 재검증
export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return { title: "프로젝트를 찾을 수 없음" };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
    },
  };
}

/**
 * 정적 경로 사전 생성 (SSG)
 */
export async function generateStaticParams() {
  try {
    const ids = await getAllProjectIds();
    return ids.map((id) => ({ id }));
  } catch {
    // Notion API 연결 실패 시 빌드 오류 방지
    return [];
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar
        brand="Portfolio"
        items={[
          { label: "홈", href: "/" },
          { label: "포트폴리오", href: "/portfolio" },
        ]}
      />
      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* 뒤로가기 */}
        <Button variant="ghost" size="sm" asChild className="mb-6 gap-2">
          <Link href="/portfolio">
            <ArrowLeft className="h-4 w-4" />
            포트폴리오로 돌아가기
          </Link>
        </Button>

        {/* 프로젝트 헤더 */}
        <article>
          {/* 썸네일 이미지 */}
          {project.imageUrl && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={project.imageUrl}
                alt={`${project.title} 썸네일`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* 카테고리 배지 */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{project.category}</Badge>
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* 제목 */}
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {project.title}
          </h1>

          {/* 설명 */}
          <p className="mb-6 text-lg text-muted-foreground">
            {project.description}
          </p>

          {/* 메타 정보 */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {project.publishedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(project.publishedDate), "yyyy년 MM월 dd일", {
                    locale: ko,
                  })}
                </span>
              </div>
            )}
            {project.tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                <span>{project.tags.join(", ")}</span>
              </div>
            )}
          </div>

          {/* 외부 링크 */}
          {project.externalLink && (
            <Button asChild className="mb-8 gap-2">
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                프로젝트 보기
              </a>
            </Button>
          )}

          <Separator className="mb-8" />

          {/* Notion 블록 콘텐츠 렌더링 */}
          {project.content && project.content.length > 0 ? (
            <NotionRenderer blocks={project.content} />
          ) : (
            <p className="text-muted-foreground">상세 내용이 없습니다.</p>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
