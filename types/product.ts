// 상품 타입 정의

export type ProductCategory =
  | "electronics"
  | "clothing"
  | "books"
  | "food"
  | "sports"
  | "beauty"
  | "home";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ProductCategory | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithImage extends Product {
  image_url?: string | null;
}

