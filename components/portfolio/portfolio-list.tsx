/**
 * 포트폴리오 프로젝트 목록 컴포넌트 (서버)
 * Notion API에서 데이터를 조회하여 카드 그리드 렌더링
 */
import { ProjectCard } from "./project-card";
import { getProjects } from "@/lib/notion";
import type { ProjectCategory, ProjectSummary } from "@/types/notion";

interface PortfolioListProps {
  category?: ProjectCategory;
  search?: string;
}

export async function PortfolioList({ category, search }: PortfolioListProps) {
  let projects: ProjectSummary[] = [];
  let error: string | null = null;

  try {
    const result = await getProjects({ category, search });
    projects = result.projects;
  } catch (e) {
    console.error("포트폴리오 데이터 로드 실패:", e);
    error = "프로젝트 목록을 불러오는데 실패했습니다.";
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12">
        <p className="text-muted-foreground">{error}</p>
        <p className="text-sm text-muted-foreground">
          환경 변수(NOTION_API_KEY, NOTION_DATABASE_ID)를 확인해주세요.
        </p>
      </div>
    );
  }

  // 빈 결과 상태
  if (projects.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-12">
        <p className="text-muted-foreground">
          {search
            ? `"${search}" 검색 결과가 없습니다.`
            : category
              ? `${category} 카테고리 프로젝트가 없습니다.`
              : "프로젝트가 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 결과 수 */}
      <p className="mb-4 text-sm text-muted-foreground">
        총 {projects.length}개의 프로젝트
      </p>

      {/* 프로젝트 카드 그리드 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
