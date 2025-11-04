import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetail } from "@/components/product-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { getProductById } from "@/actions/products";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

function ProductDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-32" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-6">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-px w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function ProductDetailContent({ productId }: { productId: string }) {
  const { product, error } = await getProductById(productId);

  if (error || !product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContent productId={id} />
      </Suspense>
    </div>
  );
}

