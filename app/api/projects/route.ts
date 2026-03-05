/**
 * 프로젝트 목록 API 라우트
 * GET /api/projects?category=웹&search=...&page=...
 *
 * 클라이언트 사이드 React Query에서 호출하거나
 * 서버 사이드에서 직접 getProjects()를 호출하는 방식 중 선택
 */
import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/notion";
import type { ProjectCategory } from "@/types/notion";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get("category") as ProjectCategory | null;
    const search = searchParams.get("search") ?? undefined;
    const pageSize = Math.min(
      Number(searchParams.get("pageSize") ?? "12"),
      50, // 최대 50개 제한
    );
    const startCursor = searchParams.get("cursor") ?? undefined;
    const featuredParam = searchParams.get("featured");
    const featured =
      featuredParam === "true"
        ? true
        : featuredParam === "false"
          ? false
          : undefined;

    const result = await getProjects({
      category: category ?? undefined,
      search,
      pageSize,
      startCursor,
      featured,
    });

    return NextResponse.json(result, {
      // 60초 캐시 (CDN 캐시 활용)
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("API /api/projects 오류:", error);
    return NextResponse.json(
      { error: "프로젝트 목록 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
