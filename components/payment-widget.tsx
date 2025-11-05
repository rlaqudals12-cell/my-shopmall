"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard } from "lucide-react";

/**
 * @file components/payment-widget.tsx
 * @description Toss Payments 결제 위젯 컴포넌트
 *
 * 이 컴포넌트는 Toss Payments v1 결제 위젯을 로드하고 결제 프로세스를 처리합니다.
 * 모의 결제 모드를 지원하여 API 키 미발급 상황에서도 테스트할 수 있습니다.
 *
 * @dependencies
 * - @/actions/payments: createPaymentRequest, confirmPayment
 * - @/components/ui/button: Button
 * - @/components/ui/card: Card
 */

interface PaymentWidgetProps {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  onSuccess: (paymentKey: string) => void | Promise<void>;
  onFail: (error: string) => void;
}

// 클라이언트 컴포넌트에서는 환경 변수를 직접 접근할 수 없으므로, 
// NEXT_PUBLIC_ 접두사가 있는 변수만 사용 가능
const MOCK_PAYMENT = process.env.NEXT_PUBLIC_MOCK_PAYMENT === "true";

export function PaymentWidget({
  orderId,
  amount,
  orderName,
  customerName,
  onSuccess,
  onFail,
}: PaymentWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // 결제 요청 생성
      const { createPaymentRequest } = await import("@/actions/payments");
      const result = await createPaymentRequest({
        orderId,
        amount,
        orderName,
        customerName,
        successUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${orderId}`,
      });

      if (result.error || !result.paymentKey) {
        onFail(result.error || "결제 요청 생성에 실패했습니다.");
        setIsLoading(false);
        return;
      }


      // 모의 결제 모드
      if (MOCK_PAYMENT) {
        // 모의 결제 승인 (시뮬레이션)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await onSuccess(result.paymentKey);
        setIsLoading(false);
        return;
      }

      // 실제 Toss Payments 위젯 로드 (API 키 발급 후 구현)
      // TODO: Toss Payments v1 위젯 스크립트 로드 및 결제 처리
      // 현재는 모의 모드만 지원
      onFail("결제 서비스가 아직 설정되지 않았습니다. 모의 결제 모드를 사용하세요.");
      setIsLoading(false);
    } catch (error) {
      console.error("Payment error:", error);
      onFail(
        error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다."
      );
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>결제 정보</CardTitle>
        <CardDescription>
          {MOCK_PAYMENT ? (
            <span className="text-amber-600">
              모의 결제 모드: 실제 결제가 발생하지 않습니다.
            </span>
          ) : (
            "결제 수단을 선택해주세요."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {MOCK_PAYMENT && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="font-semibold mb-2 text-amber-900">테스트 결제 정보:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
              <li>실제 결제가 발생하지 않습니다.</li>
              <li>결제 승인 버튼을 클릭하면 결제가 성공한 것으로 처리됩니다.</li>
              <li>실제 Toss Payments API 키를 발급받으면 실제 결제가 가능합니다.</li>
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">주문번호: {orderId}</p>
          <p className="text-sm text-muted-foreground">주문명: {orderName}</p>
          <p className="text-lg font-semibold">
            결제 금액: {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(amount)}
          </p>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              결제 진행 중...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {MOCK_PAYMENT ? "결제 승인 (테스트)" : "결제하기"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

