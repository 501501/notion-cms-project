/**
 * 포트폴리오 목록 페이지 (/portfolio)
 * 카테고리 필터링, 검색, 프로젝트 카드 그리드 표시
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";
import { PortfolioList } from "@/components/portfolio/portfolio-list";
import { PortfolioFilters } from "@/components/portfolio/portfolio-filters";
import type { ProjectCategory } from "@/types/notion";

export const metadata: Metadata = {
  title: "포트폴리오",
  description: "개인 프로젝트 포트폴리오 목록입니다. 웹, 모바일, 디자인 프로젝트를 확인하세요.",
  openGraph: {
    title: "포트폴리오",
    description: "개인 프로젝트 포트폴리오 목록",
  },
};

// ISR: 60초마다 재검증
export const revalidate = 60;

interface PortfolioPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams;
  const category = params.category as ProjectCategory | undefined;
  const search = params.search;

  return (
    <>
      <Navbar
        brand="Portfolio"
        items={[
          { label: "홈", href: "/" },
          { label: "포트폴리오", href: "/portfolio" },
        ]}
      />
      <main className="container mx-auto max-w-7xl px-4 py-12">
        {/* 페이지 헤더 */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">포트폴리오</h1>
          <p className="text-lg text-muted-foreground">
            개인 프로젝트와 작업물을 소개합니다
          </p>
        </div>

        {/* 필터 & 검색 (클라이언트 컴포넌트) */}
        <PortfolioFilters
          currentCategory={category}
          currentSearch={search}
        />

        {/* 프로젝트 목록 (서버 컴포넌트 + Suspense) */}
        <Suspense fallback={<PortfolioListSkeleton />}>
          <PortfolioList category={category} search={search} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

/**
 * 로딩 스켈레톤
 */
function PortfolioListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-xl bg-muted"
        />
      ))}
    </div>
  );
}
