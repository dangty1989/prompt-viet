"use client";

import { Search, Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { prompts, getPromptPlatforms, platforms as allPlatforms, type Prompt } from "@/data";

interface SearchFilterProps {
  onFilterChange: (filtered: Prompt[]) => void;
  variant?: "default" | "compact";
  initialCategory?: string;
  initialPlatform?: string;
  controlledCategory?: string;
  controlledPlatform?: string;
  onCategoryChange?: (category: string) => void;
  onPlatformChange?: (platform: string) => void;
}

export function SearchFilter({
  onFilterChange,
  variant = "default",
  initialCategory = "all",
  initialPlatform = "all",
  controlledCategory,
  controlledPlatform,
  onCategoryChange,
  onPlatformChange,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [internalCategory, setInternalCategory] = useState<string>(initialCategory);
  const [internalPlatform, setInternalPlatform] = useState<string>(initialPlatform);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedCategory = controlledCategory ?? internalCategory;
  const selectedPlatform = controlledPlatform ?? internalPlatform;

  const setSelectedCategory = (value: string) => {
    if (onCategoryChange) {
      onCategoryChange(value);
    } else {
      setInternalCategory(value);
    }
  };

  const setSelectedPlatform = (value: string) => {
    if (onPlatformChange) {
      onPlatformChange(value);
    } else {
      setInternalPlatform(value);
    }
  };

  const categories = useMemo(() => ["all", ...new Set(prompts.map((p: Prompt) => p.category))], []);
  const platforms = useMemo(() => ["all", ...allPlatforms], []);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt: Prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory;
      const matchesPlatform =
        selectedPlatform === "all" || getPromptPlatforms(prompt).includes(selectedPlatform);

      return matchesSearch && matchesCategory && matchesPlatform;
    });
  }, [searchQuery, selectedCategory, selectedPlatform]);

  useEffect(() => {
    onFilterChange(filteredPrompts);
  }, [filteredPrompts, onFilterChange]);

  const hasActiveFilters = selectedCategory !== "all" || selectedPlatform !== "all";

  if (variant === "compact") {
    return (
      <div
        className="search-filter-compact card animate-in"
        style={{ containerType: "inline-size" } as React.CSSProperties}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <label htmlFor="search-compact" className="sr-only">
              Tìm kiếm prompt
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-muted-foreground))]" />
            <input
              id="search-compact"
              type="search"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "btn btn-sm btn-ghost flex-shrink-0",
              showAdvanced && "bg-[rgb(var(--color-primary))/0.1] dark:bg-[rgb(var(--color-primary))/0.2] text-[rgb(var(--color-primary))]"
            )}
            aria-expanded={showAdvanced}
            aria-controls="advanced-filters-compact"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{showAdvanced ? "Ẩn" : "Lọc"}</span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedPlatform("all");
              }}
              className="btn btn-sm btn-ghost gap-1 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]"
              aria-label="Xóa bộ lọc"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div
          id="advanced-filters-compact"
          className={cn(
            "mt-3 grid gap-3 transition-all duration-200 overflow-hidden",
            showAdvanced ? "grid-cols-1 sm:grid-cols-2" : "hidden"
          )}
        >
          <div>
            <label htmlFor="category-compact" className="label text-sm">
              Danh mục
            </label>
            <select
              id="category-compact"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input text-sm"
            >
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Tất cả" : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="platform-compact" className="label text-sm">
              Nền tảng
            </label>
            <select
              id="platform-compact"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="input text-sm"
            >
              {platforms.map((plat: string) => (
                <option key={plat} value={plat}>
                  {plat === "all" ? "Tất cả" : plat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <style jsx>{`
          .search-filter-compact {
            container-type: inline-size;
          }

          @container (min-width: 480px) {
            .search-filter-compact > div:first-child {
              flex-direction: row;
              align-items: center;
            }
            .search-filter-compact > div:first-child > div:first-child {
              max-width: none;
            }
          }

          @container (min-width: 640px) {
            .search-filter-compact > div:first-child {
              gap: 1rem;
            }
            .search-filter-compact #advanced-filters-compact {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="search-filter card animate-in"
      style={{ containerType: "inline-size" } as React.CSSProperties}
    >
      <div className="mb-4">
        <label htmlFor="search" className="sr-only">
          Tìm kiếm prompt
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-muted-foreground))]" />
          <input
            id="search"
            type="search"
            placeholder="Tìm kiếm prompt... (tiêu đề, nội dung, tag)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-[rgb(var(--color-foreground))]">Bộ lọc</h4>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "btn btn-sm btn-ghost gap-1",
              showAdvanced && "bg-[rgb(var(--color-primary))/0.1] dark:bg-[rgb(var(--color-primary))/0.2] text-[rgb(var(--color-primary))]"
            )}
            aria-expanded={showAdvanced}
            aria-controls="advanced-filters"
          >
            <Filter className="w-4 h-4" />
            {showAdvanced ? "Ẩn" : "Mở rộng"}
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", showAdvanced && "rotate-180")} />
          </button>
        </div>

        <div
          id="advanced-filters"
          className={cn(
            "grid gap-4 transition-all duration-200 overflow-hidden",
            showAdvanced ? "grid-cols-1 sm:grid-cols-2" : "hidden"
          )}
        >
          <div>
            <label htmlFor="category" className="label">
              Danh mục
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Tất cả" : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="platform" className="label">
              Nền tảng
            </label>
            <select
              id="platform"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="input"
            >
              {platforms.map((plat: string) => (
                <option key={plat} value={plat}>
                  {plat === "all" ? "Tất cả" : plat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedPlatform("all");
            }}
            className="btn btn-sm btn-ghost gap-1 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]"
            aria-label="Xóa bộ lọc"
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[rgb(var(--color-border))]">
        <p className="body-sm" aria-live="polite">
          Tìm thấy <span className="font-semibold text-[rgb(var(--color-foreground))]">{filteredPrompts.length}</span> / {prompts.length} prompt
        </p>
      </div>

      <style jsx>{`
        .search-filter {
          container-type: inline-size;
        }

        @container (min-width: 480px) {
          .search-filter .mb-4 {
            margin-bottom: 1.5rem;
          }
        }

        @container (min-width: 640px) {
          .search-filter #advanced-filters {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @container (min-width: 768px) {
          .search-filter {
            padding: 1.5rem;
          }
          .search-filter .space-y-4 {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}