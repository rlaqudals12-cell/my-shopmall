import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getOrders } from "@/actions/orders";
import { OrderList } from "@/components/order-list";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * @file app/my/orders/page.tsx
 * @description 주문 내역 페이지
 *
 * 이 페이지는 사용자의 주문 내역을 목록으로 표시합니다.
 *
 * 주요 기능:
 * 1. 주문 목록 조회 및 표시
 * 2. 주문 상태 표시
 * 3. 주문 상세 보기 링크
 * 4. 로딩 상태 처리
 * 5. 빈 주문 내역 상태 처리
 *
 * @dependencies
 * - @/actions/orders: getOrders
 * - @/components/order-list: OrderList
 */

function OrderListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function OrdersContent() {
  const { orders, error } = await getOrders();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <p className="text-muted-foreground">다시 시도해주세요.</p>
      </div>
    );
  }

  return <OrderList orders={orders} />;
}

export default async function MyOrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">주문 내역</h1>
        <p className="text-muted-foreground mt-2">
          주문하신 상품의 내역을 확인하실 수 있습니다.
        </p>
      </div>

      <Suspense fallback={<OrderListSkeleton />}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}

