import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { getProducts } from "@/actions/products";
import { ProductCategory } from "@/types/product";
import { ProductsFilter } from "@/components/products-filter";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    page?: string;
  };
}

const ITEMS_PER_PAGE = 12;

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

async function ProductsList({
  category,
  sort,
  page,
}: {
  category?: string;
  sort?: string;
  page?: string;
}) {
  const currentPage = parseInt(page || "1", 10);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const sortBy =
    sort === "price_asc"
      ? "price_asc"
      : sort === "price_desc"
        ? "price_desc"
        : "created_at_desc";

  const categoryFilter =
    category && category !== "all"
      ? (category as ProductCategory)
      : undefined;

  const { products, error } = await getProducts({
    category: categoryFilter,
    limit: ITEMS_PER_PAGE,
    offset,
    sortBy,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <p className="text-muted-foreground">다시 시도해주세요.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-semibold mb-2">상품이 없습니다</p>
        <p className="text-muted-foreground">
          {categoryFilter
            ? `${categoryFilter} 카테고리에 상품이 없습니다.`
            : "등록된 상품이 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* TODO: 페이지네이션 추가 (필요시) */}
    </>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort, page } = searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">상품 목록</h1>
        <p className="text-muted-foreground">
          다양한 상품을 둘러보세요
        </p>
      </div>

      <ProductsFilter
        currentCategory={category || "all"}
        currentSort={sort || "latest"}
      />

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsList category={category} sort={sort} page={page} />
      </Suspense>
    </div>
  );
}

