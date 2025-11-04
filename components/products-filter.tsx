"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductCategory } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories: { label: string; value: ProductCategory | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "전자제품", value: "electronics" },
  { label: "의류", value: "clothing" },
  { label: "도서", value: "books" },
  { label: "식품", value: "food" },
  { label: "스포츠", value: "sports" },
  { label: "뷰티", value: "beauty" },
  { label: "생활용품", value: "home" },
];

const sortOptions = [
  { label: "최신순", value: "latest" },
  { label: "가격 낮은순", value: "price_asc" },
  { label: "가격 높은순", value: "price_desc" },
];

interface ProductsFilterProps {
  currentCategory: string;
  currentSort: string;
}

export function ProductsFilter({
  currentCategory,
  currentSort,
}: ProductsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "latest") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // 필터 변경 시 첫 페이지로
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">카테고리:</span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={
                currentCategory === cat.value || (!currentCategory && cat.value === "all")
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => updateFilter("category", cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm font-medium">정렬:</span>
        <Select
          value={currentSort || "latest"}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

