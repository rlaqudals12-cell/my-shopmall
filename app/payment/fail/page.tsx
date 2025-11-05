import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Home, ShoppingCart } from "lucide-react";

/**
 * @file app/payment/fail/page.tsx
 * @description 결제 실패 페이지
 *
 * 이 페이지는 결제가 실패했을 때 표시됩니다.
 * 실패 사유를 안내하고 재시도할 수 있는 옵션을 제공합니다.
 */

interface PaymentFailPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PaymentFailPage(
  props: PaymentFailPageProps,
) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const searchParams = await props.searchParams;
  const orderId = typeof searchParams.orderId === "string" ? searchParams.orderId : undefined;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">결제가 실패했습니다</CardTitle>
            <p className="text-muted-foreground mt-2">
              결제 처리 중 문제가 발생했습니다.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-900 mb-1">실패 사유:</p>
                <p className="text-sm text-red-800">{decodeURIComponent(error)}</p>
              </div>
            )}

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>다음과 같은 이유로 결제가 실패할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>카드 정보가 올바르지 않습니다</li>
                <li>카드 한도가 초과되었습니다</li>
                <li>네트워크 연결 문제</li>
                <li>결제 서비스 일시 중단</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {orderId && (
                <Button asChild className="flex-1" variant="outline">
                  <Link href={`/checkout?orderId=${orderId}`}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    다시 시도
                  </Link>
                </Button>
              )}
              <Button asChild className="flex-1" variant="outline">
                <Link href="/cart">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  장바구니로 이동
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

