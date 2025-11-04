"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CancelOrderDialog } from "@/components/cancel-order-dialog";
import { X } from "lucide-react";

/**
 * @file components/cancel-order-button.tsx
 * @description 주문 취소 버튼 컴포넌트
 *
 * 이 컴포넌트는 주문 취소 버튼과 Dialog를 관리합니다.
 *
 * @dependencies
 * - @/components/cancel-order-dialog: CancelOrderDialog
 */

interface CancelOrderButtonProps {
  orderId: string;
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsDialogOpen(true)}
        className="w-full"
      >
        <X className="mr-2 h-4 w-4" />
        주문 취소
      </Button>
      <CancelOrderDialog
        orderId={orderId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}

