"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { CartItemWithProduct } from "@/types/cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { clearCart } from "@/actions/cart";
import { useState } from "react";

/**
 * @file components/cart-summary.tsx
 * @description 장바구니 요약 컴포넌트
 *
 * 이 컴포넌트는 장바구니의 총 금액을 계산하고 표시합니다.
 * 주문하기 버튼과 장바구니 비우기 버튼을 제공합니다.
 *
 * @dependencies
 * - @/actions/cart: clearCart
 * - @/types/cart: CartItemWithProduct
 */

interface CartSummaryProps {
  items: CartItemWithProduct[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = 0; // TODO: 배송비 정책에 따라 변경
  const totalPaymentAmount = totalPrice + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const handleClearCart = async () => {
    if (
      !confirm("정말로 장바구니를 모두 비우시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      return;
    }

    setIsClearing(true);
    const result = await clearCart();

    if (!result.success) {
      alert(result.error || "장바구니 비우기에 실패했습니다.");
    } else {
      router.refresh();
    }

    setIsClearing(false);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>주문 요약</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">총 상품 개수</span>
            <span className="font-medium">{totalItems}개</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">총 상품 금액</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">배송비</span>
            <span className="font-medium">
              {shippingFee === 0 ? "무료" : formatPrice(shippingFee)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>총 결제 금액</span>
            <span className="text-primary">{formatPrice(totalPaymentAmount)}</span>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">
              <ShoppingCart className="mr-2 h-4 w-4" />
              주문하기
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearCart}
            disabled={isClearing || items.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isClearing ? "비우는 중..." : "장바구니 비우기"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

