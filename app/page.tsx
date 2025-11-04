import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { getLatestProducts, getPopularProducts } from "@/actions/products";
import { ProductCategory } from "@/types/product";
import { ArrowRight, ShoppingBag } from "lucide-react";

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

async function LatestProductsSection() {
  const { products } = await getLatestProducts(12);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function PopularProductsSection() {
  const { products } = await getPopularProducts(8);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showBadge badgeText="인기" />
      ))}
    </div>
  );
}

const categories: { label: string; value: ProductCategory; icon: string }[] = [
  { label: "전자제품", value: "electronics", icon: "📱" },
  { label: "의류", value: "clothing", icon: "👕" },
  { label: "도서", value: "books", icon: "📚" },
  { label: "식품", value: "food", icon: "🍔" },
  { label: "스포츠", value: "sports", icon: "⚽" },
  { label: "뷰티", value: "beauty", icon: "💄" },
  { label: "생활용품", value: "home", icon: "🏠" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              최고의 쇼핑 경험을
              <br />
              지금 시작하세요
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              다양한 상품을 한 곳에서 만나보세요. 빠르고 안전한 쇼핑을 제공합니다.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/products">
                  상품 보러가기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/products?category=electronics">
                  <ShoppingBag className="h-4 w-4" />
                  인기 상품
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-2xl font-bold">카테고리</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {categories.map((category) => (
              <Link
                key={category.value}
                href={`/products?category=${category.value}`}
                className="group flex flex-col items-center rounded-lg border bg-card p-4 transition-all hover:shadow-md"
              >
                <span className="mb-2 text-4xl">{category.icon}</span>
                <span className="text-sm font-medium group-hover:text-primary">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 상품 섹션 */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">인기 상품</h2>
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/products">
                더보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <PopularProductsSection />
          </Suspense>
        </div>
      </section>

      {/* 최신 상품 섹션 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">최신 상품</h2>
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/products">
                더보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <LatestProductsSection />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
