/**
 * 프로젝트 상세 API 라우트
 * GET /api/projects/[id]
 */
import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "@/lib/notion";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "프로젝트 ID가 필요합니다." },
        { status: 400 },
      );
    }

    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { error: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { data: project },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("API /api/projects/[id] 오류:", error);
    return NextResponse.json(
      { error: "프로젝트 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
