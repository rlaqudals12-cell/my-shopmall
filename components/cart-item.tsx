"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemWithProduct } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCartItem, removeCartItem } from "@/actions/cart";
import { useRouter } from "next/navigation";

/**
 * @file components/cart-item.tsx
 * @description 장바구니 아이템 컴포넌트
 *
 * 이 컴포넌트는 장바구니의 개별 상품을 표시하고 관리합니다.
 * 수량 변경, 삭제 기능을 제공합니다.
 *
 * @dependencies
 * - @/actions/cart: updateCartItem, removeCartItem
 * - @/types/cart: CartItemWithProduct
 */

interface CartItemProps {
  item: CartItemWithProduct;
}

export function CartItem({ item }: CartItemProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock_quantity) {
      alert(`재고가 부족합니다. (현재 재고: ${item.product.stock_quantity}개)`);
      return;
    }

    setIsUpdating(true);
    setQuantity(newQuantity);

    const result = await updateCartItem(item.id, newQuantity);

    if (!result.success) {
      alert(result.error || "수량 변경에 실패했습니다.");
      setQuantity(item.quantity); // 원래 수량으로 복구
    } else {
      router.refresh(); // 장바구니 아이템 개수 업데이트를 위해
    }

    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (!confirm("정말로 이 상품을 장바구니에서 제거하시겠습니까?")) {
      return;
    }

    setIsRemoving(true);

    const result = await removeCartItem(item.id);

    if (!result.success) {
      alert(result.error || "상품 삭제에 실패했습니다.");
    } else {
      router.refresh(); // 장바구니 아이템 개수 업데이트를 위해
    }

    setIsRemoving(false);
  };

  const isOutOfStock = item.product.stock_quantity === 0;
  const isLowStock = item.product.stock_quantity < quantity;

  return (
    <div className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0">
      {/* 상품 이미지 */}
      <Link
        href={`/products/${item.product.id}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border"
      >
        <Image
          src={
            item.product.image_url ||
            "https://via.placeholder.com/400x400?text=No+Image"
          }
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      {/* 상품 정보 및 수량 조절 */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              href={`/products/${item.product.id}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {formatPrice(item.product.price)} × {item.quantity}개
            </p>
            <p className="text-lg font-semibold mt-2">
              소계: {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>

          {/* 삭제 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">삭제</span>
          </Button>
        </div>

        {/* 수량 조절 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isUpdating || quantity <= 1}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Input
            type="number"
            min={1}
            max={item.product.stock_quantity}
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 1) {
                handleQuantityChange(value);
              }
            }}
            disabled={isUpdating}
            className="w-16 text-center"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={
              isUpdating ||
              quantity >= item.product.stock_quantity ||
              isOutOfStock
            }
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {isUpdating && (
            <span className="text-sm text-muted-foreground">변경 중...</span>
          )}
        </div>

        {/* 재고 상태 표시 */}
        {isOutOfStock && (
          <p className="text-sm text-destructive">품절된 상품입니다.</p>
        )}
        {isLowStock && !isOutOfStock && (
          <p className="text-sm text-amber-600">
            재고가 부족합니다. (재고: {item.product.stock_quantity}개)
          </p>
        )}
      </div>
    </div>
  );
}

