import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order-status-badge";
import type { Order } from "@/types/order";
import { ArrowRight, Package } from "lucide-react";

/**
 * @file components/order-list.tsx
 * @description 주문 목록 컴포넌트
 *
 * 이 컴포넌트는 주문 목록을 카드 형태로 표시합니다.
 *
 * @dependencies
 * - @/types/order: Order
 * - @/components/order-status-badge: OrderStatusBadge
 * - @/components/ui/card: Card
 */

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const getOrderIdShort = (orderId: string) => {
    return orderId.substring(0, 8).toUpperCase();
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">주문 내역이 없습니다</h3>
        <p className="text-muted-foreground mb-6">
          아직 주문한 상품이 없습니다.
        </p>
        <Button asChild>
          <Link href="/products">
            상품 둘러보기
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    주문번호
                  </span>
                  <span className="font-mono text-sm font-semibold">
                    {getOrderIdShort(order.id)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatShortDate(order.created_at)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">결제 금액</p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-3 border-t">
            <Button asChild variant="outline" className="w-full" size="sm">
              <Link href={`/my/orders/${order.id}`}>
                주문 상세 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

