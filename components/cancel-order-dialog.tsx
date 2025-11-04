"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cancelOrder } from "@/actions/orders";
import { AlertTriangle } from "lucide-react";

/**
 * @file components/cancel-order-dialog.tsx
 * @description 주문 취소 확인 Dialog 컴포넌트
 *
 * 이 컴포넌트는 주문 취소 확인 Dialog를 제공합니다.
 * 취소 사유를 입력할 수 있으며, 취소 후 주문 상태를 업데이트합니다.
 *
 * @dependencies
 * - @/actions/orders: cancelOrder
 * - @/components/ui/dialog: Dialog
 * - @/components/ui/button: Button
 * - @/components/ui/textarea: Textarea
 */

interface CancelOrderDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelOrderDialog({
  orderId,
  open,
  onOpenChange,
}: CancelOrderDialogProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  async function handleCancel() {
    setIsCancelling(true);
    try {
      const result = await cancelOrder(orderId);

      if (!result.success) {
        alert(result.error || "주문 취소에 실패했습니다.");
        setIsCancelling(false);
        return;
      }

      // 성공 시 Dialog 닫기 및 페이지 새로고침
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Cancel order error:", error);
      alert(error instanceof Error ? error.message : "주문 취소 중 오류가 발생했습니다.");
      setIsCancelling(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            주문 취소 확인
          </DialogTitle>
          <DialogDescription>
            정말로 이 주문을 취소하시겠습니까? 취소된 주문은 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cancelReason">취소 사유 (선택사항)</Label>
            <Textarea
              id="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="취소 사유를 입력해주세요..."
              rows={3}
              disabled={isCancelling}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCancelling}
          >
            닫기
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? "취소 중..." : "주문 취소"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

