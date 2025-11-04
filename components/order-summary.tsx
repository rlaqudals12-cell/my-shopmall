import { CartItemWithProduct } from "@/types/cart";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

/**
 * @file components/order-summary.tsx
 * @description 주문 요약 컴포넌트
 *
 * 이 컴포넌트는 결제 페이지에서 주문 상품 목록과 총 금액을 표시합니다.
 *
 * @dependencies
 * - @/types/cart: CartItemWithProduct
 * - @/components/ui/card: Card, CardContent, CardHeader, CardTitle
 * - @/components/ui/separator: Separator
 * - next/image: Image
 */

interface OrderSummaryProps {
  items: CartItemWithProduct[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>주문 요약</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 주문 상품 목록 */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={
                    item.product.image_url ||
                    "https://via.placeholder.com/400x400?text=No+Image"
                  }
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.product.price)} × {item.quantity}개
                </p>
                <p className="text-sm font-semibold">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* 총 금액 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>총 상품 개수</span>
            <span>{totalItems}개</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>총 상품 금액</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>총 결제 금액</span>
            <span className="text-primary">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

