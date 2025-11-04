"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { PaymentWidget } from "@/components/payment-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrder } from "@/actions/orders";
import { confirmPayment } from "@/actions/payments";
import { confirmOrder } from "@/actions/orders";
import type { CheckoutFormData } from "@/lib/validations/checkout";
import type { CartItemWithProduct } from "@/types/cart";

/**
 * @file components/checkout-client.tsx
 * @description 결제 페이지 클라이언트 컴포넌트
 *
 * 이 컴포넌트는 결제 페이지의 클라이언트 사이드 로직을 처리합니다.
 * 배송지 입력 폼과 결제 위젯을 관리합니다.
 */

interface CheckoutClientProps {
  items: CartItemWithProduct[];
  totalAmount: number;
  orderName: string;
}

export function CheckoutClient({
  items,
  totalAmount,
  orderName,
}: CheckoutClientProps) {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerNameState, setCustomerNameState] = useState<string>("");

  async function handleCheckoutSubmit(data: CheckoutFormData) {
    setIsSubmitting(true);
    try {
      // 주문 생성
      const shippingAddress = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        address_detail: data.addressDetail || undefined,
        postal_code: data.postalCode,
      };

      // 고객 이름 저장 (결제 위젯에서 사용)
      setCustomerNameState(data.name);

      const result = await createOrder({
        items,
        shippingAddress,
        orderNote: data.orderNote,
      });

      if (result.error || !result.orderId) {
        alert(result.error || "주문 생성에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      setOrderId(result.orderId);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error instanceof Error ? error.message : "주문 생성에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  async function handlePaymentSuccess(paymentKey: string) {
    if (!orderId) return;

    try {
      // 결제 승인
      const paymentResult = await confirmPayment({
        paymentKey,
        orderId,
        amount: totalAmount,
      });

      if (!paymentResult.success) {
        alert(paymentResult.error || "결제 승인에 실패했습니다.");
        router.push(`/payment/fail?orderId=${orderId}&error=${encodeURIComponent(paymentResult.error || "결제 승인 실패")}`);
        return;
      }

      // 주문 승인
      const orderResult = await confirmOrder(orderId, paymentKey);
      if (!orderResult.success) {
        alert(orderResult.error || "주문 승인에 실패했습니다.");
        router.push(`/payment/fail?orderId=${orderId}&error=${encodeURIComponent(orderResult.error || "주문 승인 실패")}`);
        return;
      }

      // 성공 페이지로 이동
      router.push(`/payment/success?orderId=${orderId}`);
    } catch (error) {
      console.error("Payment confirmation error:", error);
      alert(error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다.");
      router.push(`/payment/fail?orderId=${orderId}&error=${encodeURIComponent(error instanceof Error ? error.message : "알 수 없는 오류")}`);
    }
  }

  function handlePaymentFail(error: string) {
    if (!orderId) return;
    router.push(`/payment/fail?orderId=${orderId}&error=${encodeURIComponent(error)}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>배송지 정보</CardTitle>
      </CardHeader>
      <CardContent>
        {orderId ? (
          <PaymentWidget
            orderId={orderId}
            amount={totalAmount}
            orderName={orderName}
            customerName={customerNameState || "고객"}
            onSuccess={handlePaymentSuccess}
            onFail={handlePaymentFail}
          />
        ) : (
          <CheckoutForm onSubmit={handleCheckoutSubmit} isLoading={isSubmitting} />
        )}
      </CardContent>
    </Card>
  );
}

