import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/order";

/**
 * @file components/order-status-badge.tsx
 * @description 주문 상태 배지 컴포넌트
 *
 * 이 컴포넌트는 주문 상태를 색상이 구분된 배지로 표시합니다.
 *
 * @dependencies
 * - @/components/ui/badge: Badge
 * - @/types/order: OrderStatus
 */

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  pending: { label: "대기 중", variant: "default", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "확인됨", variant: "default", className: "bg-blue-100 text-blue-800 border-blue-200" },
  shipped: { label: "배송 중", variant: "default", className: "bg-purple-100 text-purple-800 border-purple-200" },
  delivered: { label: "배송 완료", variant: "default", className: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "취소됨", variant: "secondary", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className || className}>
      {config.label}
    </Badge>
  );
}

