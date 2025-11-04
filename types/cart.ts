// 장바구니 타입 정의

import { Product } from "./product";

export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface CartSummary {
  total_items: number;
  total_price: number;
}

