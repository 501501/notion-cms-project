/**
 * 포트폴리오 필터 & 검색 컴포넌트 (클라이언트)
 * 카테고리 탭, 검색 입력 - URL 쿼리 파라미터로 상태 관리
 */
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types/notion";

const CATEGORIES: { label: string; value: ProjectCategory | "전체" }[] = [
  { label: "전체", value: "전체" },
  { label: "웹", value: "웹" },
  { label: "모바일", value: "모바일" },
  { label: "디자인", value: "디자인" },
  { label: "기타", value: "기타" },
];

interface PortfolioFiltersProps {
  currentCategory?: ProjectCategory;
  currentSearch?: string;
}

export function PortfolioFilters({
  currentCategory,
  currentSearch,
}: PortfolioFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(currentSearch ?? "");

  /**
   * URL 쿼리 파라미터 업데이트
   */
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams();

      // 현재 카테고리 유지
      if (currentCategory) params.set("category", currentCategory);
      // 현재 검색 유지
      if (currentSearch) params.set("search", currentSearch);

      // 업데이트 적용
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      startTransition(() => {
        const query = params.toString();
        router.push(`${pathname}${query ? `?${query}` : ""}`);
      });
    },
    [router, pathname, currentCategory, currentSearch]
  );

  /**
   * 카테고리 변경 처리
   */
  const handleCategoryChange = (category: ProjectCategory | "전체") => {
    updateParams({
      category: category === "전체" ? undefined : category,
    });
  };

  /**
   * 검색 제출 처리
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchValue || undefined });
  };

  /**
   * 검색 초기화
   */
  const clearSearch = () => {
    setSearchValue("");
    updateParams({ search: undefined });
  };

  return (
    <div className="mb-8 space-y-4">
      {/* 카테고리 필터 탭 */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ label, value }) => {
          const isActive =
            value === "전체" ? !currentCategory : currentCategory === value;

          return (
            <button
              key={value}
              onClick={() => handleCategoryChange(value)}
              disabled={isPending}
              className={cn(
                "cursor-pointer",
                isActive && "pointer-events-none"
              )}
            >
              <Badge
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-1.5 text-sm transition-colors",
                  !isActive && "hover:bg-muted"
                )}
              >
                {label}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* 검색 입력 */}
      <form onSubmit={handleSearchSubmit} className="flex max-w-md gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="프로젝트 검색..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-9"
            aria-label="프로젝트 검색"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="검색 초기화"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" variant="secondary" disabled={isPending}>
          검색
        </Button>
      </form>
    </div>
  );
}
