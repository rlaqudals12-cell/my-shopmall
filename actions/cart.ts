"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import type { CartItemWithProduct } from "@/types/cart";

/**
 * @file actions/cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * 이 파일은 장바구니 관련 서버 사이드 로직을 처리합니다.
 * Clerk 인증을 사용하여 사용자별 장바구니 데이터를 관리합니다.
 *
 * 주요 기능:
 * 1. 장바구니 아이템 개수 조회 (Navbar용)
 * 2. 장바구니 아이템 조회 (상품 정보 포함)
 * 3. 장바구니에 상품 추가
 * 4. 장바구니 아이템 수량 변경
 * 5. 장바구니 아이템 삭제
 * 6. 장바구니 비우기
 *
 * 핵심 구현 로직:
 * - Clerk auth()를 사용하여 현재 사용자 ID 가져오기
 * - Supabase createClerkSupabaseClient()를 사용하여 인증된 클라이언트 생성
 * - cart_items 테이블의 clerk_id로 사용자별 데이터 조회
 * - UNIQUE 제약 (clerk_id, product_id)을 활용한 중복 상품 처리
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 함수
 * - @/lib/supabase/server: createClerkSupabaseClient()
 * - @/types/cart: CartItem, CartItemWithProduct 타입
 */

/**
 * 장바구니 아이템 총 개수 조회 (Navbar용)
 * @returns 장바구니 아이템 총 개수 (quantity 합계)
 */
export async function getCartItemCount(): Promise<number> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return 0;
    }

    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error fetching cart item count:", error);
      return 0;
    }

    if (!data || data.length === 0) {
      return 0;
    }

    // quantity의 합계 계산
    const totalCount = data.reduce((sum, item) => sum + item.quantity, 0);

    return totalCount;
  } catch (error) {
    console.error("Error in getCartItemCount:", error);
    return 0;
  }
}

/**
 * 장바구니 아이템 조회 (상품 정보 포함)
 * @returns 장바구니 아이템 목록 (상품 정보 포함) 또는 에러 메시지
 */
export async function getCartItems(): Promise<{
  items: CartItemWithProduct[];
  error: string | null;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { items: [], error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템과 상품 정보 조회
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq("clerk_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching cart items:", error);
      return {
        items: [],
        error: "장바구니를 불러오는데 실패했습니다.",
      };
    }

    if (!data || data.length === 0) {
      return { items: [], error: null };
    }

    // 타입 변환
    const items: CartItemWithProduct[] = data.map((item: any) => ({
      id: item.id,
      clerk_id: item.clerk_id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: item.product,
    }));

    return { items, error: null };
  } catch (error) {
    console.error("Error in getCartItems:", error);
    return {
      items: [],
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니에 상품 추가
 * @param productId 상품 ID
 * @param quantity 수량
 * @returns 성공 여부 및 에러 메시지
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    if (quantity <= 0) {
      return { success: false, error: "수량은 1개 이상이어야 합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 상품 조회 및 재고 확인
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock_quantity, name, is_active")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return { success: false, error: "상품을 찾을 수 없습니다." };
    }

    if (!product.is_active) {
      return { success: false, error: "판매 중지된 상품입니다." };
    }

    if (product.stock_quantity < quantity) {
      return {
        success: false,
        error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // 기존 장바구니 아이템 확인
    const { data: existingItem, error: existingError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("clerk_id", userId)
      .eq("product_id", productId)
      .single();

    if (existingItem) {
      // 이미 존재하는 상품이면 수량 증가
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock_quantity < newQuantity) {
        return {
          success: false,
          error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개, 장바구니: ${existingItem.quantity}개)`,
        };
      }

      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id);

      if (updateError) {
        console.error("Error updating cart item:", updateError);
        return { success: false, error: "장바구니 업데이트에 실패했습니다." };
      }

      return { success: true, error: null };
    } else {
      // 새 상품 추가
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          clerk_id: userId,
          product_id: productId,
          quantity: quantity,
        });

      if (insertError) {
        console.error("Error adding to cart:", insertError);
        return { success: false, error: "장바구니 추가에 실패했습니다." };
      }

      return { success: true, error: null };
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 수량 변경
 * @param cartItemId 장바구니 아이템 ID
 * @param quantity 새로운 수량
 * @returns 성공 여부 및 에러 메시지
 */
export async function updateCartItem(
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    if (quantity <= 0) {
      return { success: false, error: "수량은 1개 이상이어야 합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템 조회 및 소유권 확인
    const { data: cartItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("*, product:products(stock_quantity)")
      .eq("id", cartItemId)
      .eq("clerk_id", userId)
      .single();

    if (fetchError || !cartItem) {
      return { success: false, error: "장바구니 아이템을 찾을 수 없습니다." };
    }

    // 재고 확인
    const product = cartItem.product as any;
    if (product.stock_quantity < quantity) {
      return {
        success: false,
        error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // 수량 업데이트
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: quantity })
      .eq("id", cartItemId);

    if (updateError) {
      console.error("Error updating cart item:", updateError);
      return { success: false, error: "수량 변경에 실패했습니다." };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 삭제
 * @param cartItemId 장바구니 아이템 ID
 * @returns 성공 여부 및 에러 메시지
 */
export async function removeCartItem(
  cartItemId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템 조회 및 소유권 확인
    const { data: cartItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("id", cartItemId)
      .eq("clerk_id", userId)
      .single();

    if (fetchError || !cartItem) {
      return { success: false, error: "장바구니 아이템을 찾을 수 없습니다." };
    }

    // 삭제
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (deleteError) {
      console.error("Error removing cart item:", deleteError);
      return { success: false, error: "장바구니 아이템 삭제에 실패했습니다." };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in removeCartItem:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 비우기
 * @returns 성공 여부 및 에러 메시지
 */
export async function clearCart(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error: "장바구니를 비우는데 실패했습니다." };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in clearCart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
