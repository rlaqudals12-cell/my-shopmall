"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { Product, ProductCategory } from "@/types/product";

export async function getProducts(options?: {
  category?: ProductCategory | null;
  limit?: number;
  offset?: number;
  sortBy?: "price_asc" | "price_desc" | "created_at_desc" | "created_at_asc";
}) {
  try {
    const supabase = createClerkSupabaseClient();

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    // 카테고리 필터
    if (options?.category) {
      query = query.eq("category", options.category);
    }

    // 정렬
    if (options?.sortBy) {
      switch (options.sortBy) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "created_at_desc":
          query = query.order("created_at", { ascending: false });
          break;
        case "created_at_asc":
          query = query.order("created_at", { ascending: true });
          break;
      }
    } else {
      // 기본 정렬: 최신순
      query = query.order("created_at", { ascending: false });
    }

    // 페이지네이션
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 20) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error("상품을 불러오는데 실패했습니다.");
    }

    return {
      products: (data as Product[]) || [],
      error: null,
    };
  } catch (error) {
    console.error("Error in getProducts:", error);
    return {
      products: [],
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

export async function getProductById(id: string) {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      throw new Error("상품을 찾을 수 없습니다.");
    }

    return {
      product: data as Product | null,
      error: null,
    };
  } catch (error) {
    console.error("Error in getProductById:", error);
    return {
      product: null,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

export async function getProductsByCategory(
  category: ProductCategory,
  limit?: number
) {
  return getProducts({ category, limit, sortBy: "created_at_desc" });
}

export async function getLatestProducts(limit: number = 12) {
  return getProducts({ limit, sortBy: "created_at_desc" });
}

export async function getPopularProducts(limit: number = 8) {
  // 현재 판매량 필드가 없으므로 최신순으로 대체
  return getProducts({ limit, sortBy: "created_at_desc" });
}

