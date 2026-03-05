/**
 * 프로젝트 카드 컴포넌트
 * 포트폴리오 목록에서 개별 프로젝트를 표시
 */
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectSummary } from "@/types/notion";

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* 썸네일 */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={`${project.title} 썸네일`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          // 이미지 없을 때 플레이스홀더
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="text-sm">{project.category}</span>
          </div>
        )}
        {/* 카테고리 오버레이 배지 */}
        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {project.category}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {/* 제목 */}
        <Link
          href={`/portfolio/${project.id}`}
          className="line-clamp-2 text-lg font-semibold leading-tight hover:text-primary"
        >
          {project.title}
        </Link>

        {/* 설명 */}
        <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
          {project.description || "설명이 없습니다."}
        </p>

        {/* 태그 */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 4 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{project.tags.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-5 py-3">
        {/* 날짜 */}
        {project.publishedDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {format(new Date(project.publishedDate), "yyyy.MM", { locale: ko })}
            </span>
          </div>
        )}

        <div className="ml-auto flex gap-2">
          {/* 외부 링크 버튼 */}
          {project.externalLink && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8"
              title="외부 링크"
            >
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          {/* 상세 보기 버튼 */}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/portfolio/${project.id}`}>자세히 보기</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
