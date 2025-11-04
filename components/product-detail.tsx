"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { AddToCartDialog } from "@/components/add-to-cart-dialog";
import { addToCart } from "@/actions/cart";

interface ProductDetailProps {
  product: Product;
}

const categoryLabels: Record<string, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활용품",
};

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const totalPrice = product.price * quantity;
  const isOutOfStock = product.stock_quantity === 0;

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, product.stock_quantity));
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const result = await addToCart(product.id, quantity);

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
  };

  const handleBuyNow = async () => {
    setIsAdding(true);
    try {
      // 먼저 장바구니에 추가
      const result = await addToCart(product.id, quantity);

      if (!result.success) {
        alert(result.error || "장바구니 추가에 실패했습니다.");
        setIsAdding(false);
        return;
      }

      // 장바구니에 추가 후 결제 페이지로 이동
      router.push("/checkout");
    } catch (error) {
      console.error("Buy now error:", error);
      alert(error instanceof Error ? error.message : "바로 구매 중 오류가 발생했습니다.");
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <Link href="/products">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          상품 목록으로
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 상품 이미지 */}
        <div>
          <ProductImageGallery product={product} />
        </div>

        {/* 상품 정보 */}
        <div className="space-y-6">
          {/* 카테고리 배지 */}
          {product.category && (
            <Badge variant="secondary">
              {categoryLabels[product.category] || product.category}
            </Badge>
          )}

          {/* 상품명 */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <Separator />

          {/* 가격 */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            {quantity > 1 && (
              <div className="text-sm text-muted-foreground">
                단가: {formatPrice(product.price)} × {quantity}개 ={" "}
                {formatPrice(totalPrice)}
              </div>
            )}
          </div>

          <Separator />

          {/* 재고 정보 */}
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">
              재고:{" "}
              <span
                className={
                  isOutOfStock
                    ? "font-semibold text-destructive"
                    : "font-semibold"
                }
              >
                {product.stock_quantity}개
              </span>
            </span>
          </div>

          {/* 수량 선택 */}
          {!isOutOfStock && (
            <div className="space-y-2">
              <label className="text-sm font-medium">수량</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground">
                  (최대 {product.stock_quantity}개)
                </span>
              </div>
            </div>
          )}

          <Separator />

          {/* 상품 설명 */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">상품 설명</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {product.description || "상품 설명이 없습니다."}
            </p>
          </div>

          <Separator />

          {/* 버튼 영역 */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
            >
              <ShoppingCart className="h-5 w-5" />
              {isAdding ? "추가 중..." : "장바구니에 추가"}
            </Button>
            <Button
              size="lg"
              variant="default"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={isOutOfStock || isAdding}
            >
              {isAdding ? "처리 중..." : "바로 구매"}
            </Button>
          </div>

          {isOutOfStock && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
              <p className="font-semibold text-destructive">품절된 상품입니다</p>
              <p className="text-sm text-muted-foreground">
                재입고 알림을 받으시려면 관심상품에 추가해주세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 장바구니 담기 Dialog */}
      <AddToCartDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        productName={product.name}
      />
    </div>
  );
}

