import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/actions/cart";
import { CartItem } from "@/components/cart-item";
import { CartSummary } from "@/components/cart-summary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * @file app/cart/page.tsx
 * @description 장바구니 페이지
 *
 * 이 페이지는 사용자의 장바구니 아이템을 표시하고 관리합니다.
 *
 * 주요 기능:
 * 1. 장바구니 아이템 목록 표시
 * 2. 수량 변경
 * 3. 아이템 삭제
 * 4. 총 금액 계산
 * 5. 주문하기 버튼
 * 6. 빈 장바구니 상태 처리
 *
 * @dependencies
 * - @/actions/cart: getCartItems
 * - @/components/cart-item: CartItem
 * - @/components/cart-summary: CartSummary
 */

function CartItemsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function CartContent() {
  const { items, error } = await getCartItems();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button asChild variant="outline">
          <Link href="/products">상품 둘러보기</Link>
        </Button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">장바구니가 비어있습니다</h3>
        <p className="text-muted-foreground mb-6">
          장바구니에 담긴 상품이 없습니다.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로
            </Link>
          </Button>
          <Button asChild>
            <Link href="/products">상품 둘러보기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* 장바구니 아이템 목록 */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 주문 요약 */}
      <div className="lg:col-span-1">
        <CartSummary items={items} />
      </div>
    </div>
  );
}

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">장바구니</h1>
        <p className="text-muted-foreground mt-2">
          장바구니에 담긴 상품을 확인하고 주문하세요.
        </p>
      </div>

      <Suspense fallback={<CartItemsSkeleton />}>
        <CartContent />
      </Suspense>
    </div>
  );
}

