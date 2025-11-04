"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingCart } from "lucide-react";

/**
 * @file components/add-to-cart-dialog.tsx
 * @description 장바구니 담기 성공 Dialog 컴포넌트
 *
 * 이 컴포넌트는 장바구니에 상품을 성공적으로 추가했을 때 표시되는 Dialog입니다.
 * 사용자가 장바구니로 이동하거나 계속 쇼핑할 수 있는 옵션을 제공합니다.
 *
 * @dependencies
 * - @/components/ui/dialog: Dialog
 * - @/components/ui/button: Button
 */

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
}

export function AddToCartDialog({
  open,
  onOpenChange,
  productName,
}: AddToCartDialogProps) {
  const router = useRouter();

  const handleGoToCart = () => {
    onOpenChange(false);
    router.push("/cart");
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            장바구니에 추가되었습니다
          </DialogTitle>
          <DialogDescription>
            {productName
              ? `${productName}이(가) 장바구니에 추가되었습니다.`
              : "상품이 장바구니에 추가되었습니다."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={handleContinueShopping}>
            계속 쇼핑하기
          </Button>
          <Button onClick={handleGoToCart} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            장바구니로 이동
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

