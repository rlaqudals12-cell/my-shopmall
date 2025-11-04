import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getOrders } from "@/actions/orders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Package, ShoppingCart, Home, User } from "lucide-react";

/**
 * @file app/my/page.tsx
 * @description 마이페이지 메인
 *
 * 이 페이지는 사용자의 프로필 정보와 빠른 링크를 제공합니다.
 * Clerk에서 사용자 정보를 가져와 표시합니다.
 *
 * 주요 기능:
 * 1. 프로필 정보 표시
 * 2. 주문 통계 (선택사항)
 * 3. 빠른 링크
 *
 * @dependencies
 * - @clerk/nextjs/server: auth, clerkClient
 * - @/actions/orders: getOrders
 */

export default async function MyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Clerk에서 사용자 정보 가져오기
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  // 주문 통계 계산 (선택사항)
  const { orders } = await getOrders();
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "confirmed"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;
  const totalAmount = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total_amount), 0);

  const userName =
    clerkUser.fullName ||
    clerkUser.username ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    "사용자";
  const userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <p className="text-muted-foreground mt-2">
          주문 내역을 확인하고 계정을 관리하세요.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 프로필 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              프로필 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">이름</p>
              <p className="font-semibold">{userName}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">이메일</p>
              <p className="font-semibold">{userEmail}</p>
            </div>
          </CardContent>
        </Card>

        {/* 주문 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              주문 통계
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 주문</p>
                <p className="text-2xl font-bold">{totalOrders}건</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">진행 중</p>
                <p className="text-2xl font-bold text-blue-600">{pendingOrders}건</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">완료</p>
                <p className="text-2xl font-bold text-green-600">{completedOrders}건</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 구매액</p>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(totalAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 빠른 링크 */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 링크</CardTitle>
            <CardDescription>주요 페이지로 빠르게 이동하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start" size="lg">
              <Link href="/my/orders">
                <Package className="mr-2 h-4 w-4" />
                주문 내역 보기
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start" size="lg">
              <Link href="/cart">
                <ShoppingCart className="mr-2 h-4 w-4" />
                장바구니
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start" size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                홈으로
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

