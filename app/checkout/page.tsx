import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/actions/cart";
import { CheckoutClient } from "@/components/checkout-client";
import { OrderSummary } from "@/components/order-summary";

/**
 * @file app/checkout/page.tsx
 * @description 결제 페이지
 *
 * 이 페이지는 장바구니에서 결제하기 버튼을 클릭했을 때 표시됩니다.
 * 배송지 입력, 주문 확인, 결제 처리를 수행합니다.
 *
 * 주요 기능:
 * 1. 장바구니 아이템 조회 및 표시
 * 2. 배송지 입력 폼
 * 3. 주문 요약
 * 4. 결제 위젯을 통한 결제 처리
 *
 * @dependencies
 * - @/actions/cart: getCartItems
 * - @/components/checkout-client: CheckoutClient
 * - @/components/order-summary: OrderSummary
 */

export default async function CheckoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 장바구니 아이템 조회
  const { items, error: cartError } = await getCartItems();

  if (cartError || !items || items.length === 0) {
    redirect("/cart");
  }

  // 총 금액 계산
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const orderName = items.length === 1
    ? items[0].product.name
    : `${items[0].product.name} 외 ${items.length - 1}개`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">결제하기</h1>
        <p className="text-muted-foreground mt-2">
          주문 정보를 확인하고 결제를 진행해주세요.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 왼쪽: 배송지 입력 및 결제 */}
        <div className="space-y-6">
          <CheckoutClient items={items} totalAmount={totalAmount} orderName={orderName} />
        </div>

        {/* 오른쪽: 주문 요약 */}
        <div>
          <OrderSummary items={items} />
        </div>
      </div>
    </div>
  );
}

