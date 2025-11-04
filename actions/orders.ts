"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import type {
  Order,
  OrderItem,
  OrderWithItems,
  ShippingAddress,
  OrderStatus,
} from "@/types/order";
import { CartItemWithProduct } from "@/types/cart";
import { clearCart } from "./cart";

/**
 * @file actions/orders.ts
 * @description 주문 관련 Server Actions
 *
 * 이 파일은 주문 생성, 조회, 상태 업데이트 등의 서버 사이드 로직을 처리합니다.
 * Clerk 인증을 사용하여 사용자별 주문 데이터를 관리합니다.
 *
 * 주요 기능:
 * 1. 주문 생성 (status = 'pending')
 * 2. 주문 승인 (status = 'confirmed', 장바구니 비우기)
 * 3. 주문 조회 (단일, 목록)
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 함수
 * - @/lib/supabase/server: createClerkSupabaseClient()
 * - @/types/order: Order, OrderItem, ShippingAddress 타입
 * - @/actions/cart: clearCart() 함수
 */

interface CreateOrderParams {
  items: CartItemWithProduct[];
  shippingAddress: ShippingAddress;
  orderNote?: string;
}

/**
 * 주문 생성
 * @param items 장바구니 아이템 목록 (상품 정보 포함)
 * @param shippingAddress 배송지 정보
 * @param orderNote 주문 메모 (선택)
 * @returns 생성된 주문 ID 또는 에러 메시지
 */
export async function createOrder({
  items,
  shippingAddress,
  orderNote,
}: CreateOrderParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { orderId: null, error: "로그인이 필요합니다." };
    }

    if (!items || items.length === 0) {
      return { orderId: null, error: "주문할 상품이 없습니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 총 금액 계산
    const totalAmount = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 재고 확인
    for (const item of items) {
      if (item.product.stock_quantity < item.quantity) {
        return {
          orderId: null,
          error: `${item.product.name}의 재고가 부족합니다.`,
        };
      }
    }

    // 주문 생성
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        clerk_id: userId,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: shippingAddress,
        order_note: orderNote || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return {
        orderId: null,
        error: "주문 생성에 실패했습니다.",
      };
    }

    // 주문 상품 저장
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // 주문 삭제 (롤백)
      await supabase.from("orders").delete().eq("id", order.id);
      return {
        orderId: null,
        error: "주문 상품 저장에 실패했습니다.",
      };
    }

    return { orderId: order.id, error: null };
  } catch (error) {
    console.error("Error in createOrder:", error);
    return {
      orderId: null,
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 승인 (결제 완료 후)
 * @param orderId 주문 ID
 * @param paymentKey 결제 키 (Toss Payments)
 * @returns 성공 여부 및 에러 메시지
 */
export async function confirmOrder(orderId: string, paymentKey: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 주문 조회 및 소유권 확인
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (fetchError || !order) {
      return { success: false, error: "주문을 찾을 수 없습니다." };
    }

    if (order.status !== "pending") {
      return { success: false, error: "이미 처리된 주문입니다." };
    }

    // 주문 상태 업데이트
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return { success: false, error: "주문 상태 업데이트에 실패했습니다." };
    }

    // 장바구니 비우기
    const clearResult = await clearCart();
    if (!clearResult.success) {
      console.error("Error clearing cart:", clearResult.error);
      // 장바구니 비우기 실패는 경고만 하고 주문은 성공으로 처리
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in confirmOrder:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 상세 조회
 * @param orderId 주문 ID
 * @returns 주문 정보 (상품 목록 포함) 또는 에러 메시지
 */
export async function getOrderById(
  orderId: string
): Promise<{ order: OrderWithItems | null; error: string | null }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { order: null, error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 주문 조회
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (orderError || !order) {
      return { order: null, error: "주문을 찾을 수 없습니다." };
    }

    // 주문 상품 조회
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return { order: null, error: "주문 상품을 불러오는데 실패했습니다." };
    }

    return {
      order: {
        ...(order as Order),
        items: (items || []) as OrderItem[],
      },
      error: null,
    };
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return {
      order: null,
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 목록 조회
 * @returns 주문 목록 또는 에러 메시지
 */
export async function getOrders(): Promise<{
  orders: Order[];
  error: string | null;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { orders: [], error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("clerk_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return { orders: [], error: "주문 목록을 불러오는데 실패했습니다." };
    }

    return { orders: (data || []) as Order[], error: null };
  } catch (error) {
    console.error("Error in getOrders:", error);
    return {
      orders: [],
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 취소
 * @param orderId 주문 ID
 * @returns 성공 여부 및 에러 메시지
 */
export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 주문 조회 및 소유권 확인
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (fetchError || !order) {
      return { success: false, error: "주문을 찾을 수 없습니다." };
    }

    // 취소 가능한 상태 확인
    const cancellableStatuses: OrderStatus[] = ["pending", "confirmed"];
    if (!cancellableStatuses.includes(order.status as OrderStatus)) {
      return {
        success: false,
        error: `주문 상태가 '${order.status}'인 경우 취소할 수 없습니다.`,
      };
    }

    // 주문 상태 업데이트
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error cancelling order:", updateError);
      return { success: false, error: "주문 취소에 실패했습니다." };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

