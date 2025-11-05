import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCartItemCount } from "@/actions/cart";

/**
 * @file components/cart-icon.tsx
 * @description 장바구니 아이콘 컴포넌트 (Server Component)
 *
 * 이 컴포넌트는 Navbar에서 사용되는 장바구니 아이콘을 표시합니다.
 * Server Component로 구현되어 장바구니 아이템 개수를 서버에서 가져옵니다.
 *
 * 주요 기능:
 * 1. 로그인한 사용자의 장바구니 아이템 개수 표시
 * 2. 장바구니 아이콘 클릭 시 장바구니 페이지로 이동
 * 3. 로그인하지 않은 사용자는 아이콘 미표시
 *
 * @dependencies
 * - @clerk/nextjs: SignedIn, SignedOut
 * - @/actions/cart: getCartItemCount
 * - @/components/ui/button: Button
 * - @/components/ui/badge: Badge
 * - lucide-react: ShoppingCart
 */

export async function CartIcon() {
  return (
    <SignedIn>
      <CartIconContent />
    </SignedIn>
  );
}

async function CartIconContent() {
  const itemCount = await getCartItemCount();

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">장바구니</span>
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
