import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrderById } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Home, Package } from "lucide-react";

/**
 * @file app/payment/success/page.tsx
 * @description 결제 성공 페이지
 *
 * 이 페이지는 결제가 성공적으로 완료되었을 때 표시됩니다.
 * 주문 정보를 확인할 수 있습니다.
 */

interface PaymentSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function PaymentSuccessPage(
  props: PaymentSuccessPageProps,
) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { orderId } = await props.searchParams;

  if (!orderId) {
    redirect("/");
  }

  const { order, error } = await getOrderById(orderId);

  if (error || !order) {
    redirect("/");
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">결제가 완료되었습니다!</CardTitle>
            <p className="text-muted-foreground mt-2">
              주문이 성공적으로 처리되었습니다.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 번호</span>
                <span className="font-semibold">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 금액</span>
                <span className="font-semibold text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 상태</span>
                <span className="font-semibold">확인됨</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1" variant="outline">
                <Link href={`/my/orders/${order.id}`}>
                  <Package className="mr-2 h-4 w-4" />
                  주문 상세 보기
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  홈으로 이동
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

