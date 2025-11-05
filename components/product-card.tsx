"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddToCartDialog } from "@/components/add-to-cart-dialog";
import { addToCart } from "@/actions/cart";

interface ProductCardProps {
  product: Product & { image_url?: string | null };
  showBadge?: boolean;
  badgeText?: string;
}

export function ProductCard({
  product,
  showBadge = false,
  badgeText = "인기",
}: ProductCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  // Placeholder 이미지 URL (이미지가 없을 경우)
  const imageUrl =
    product.image_url || "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {showBadge && (
            <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
              {badgeText}
            </div>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-lg font-semibold text-white">품절</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="mb-2 line-clamp-2 font-semibold transition-colors hover:text-primary">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description || "상품 설명이 없습니다."}
          </p>
        </Link>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="text-lg font-bold text-primary">
          {formatPrice(product.price)}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={async (e) => {
            e.preventDefault();
            if (product.stock_quantity === 0) return;

            setIsAdding(true);
            try {
              const result = await addToCart(product.id, 1);

              if (!result.success) {
                alert(result.error || "장바구니 추가에 실패했습니다.");
              } else {
                setShowDialog(true);
                router.refresh(); // Navbar의 장바구니 아이콘 업데이트를 위해
              }
            } catch (error) {
              console.error("Add to cart error:", error);
              alert(error instanceof Error ? error.message : "장바구니 추가 중 오류가 발생했습니다.");
            } finally {
              setIsAdding(false);
            }
          }}
          disabled={product.stock_quantity === 0 || isAdding}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">{isAdding ? "추가 중..." : "담기"}</span>
        </Button>
      </CardFooter>

      {/* 장바구니 담기 Dialog */}
      <AddToCartDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        productName={product.name}
      />
    </Card>
  );
}

