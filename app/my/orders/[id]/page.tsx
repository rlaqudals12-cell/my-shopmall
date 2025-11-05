import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getOrderById } from "@/actions/orders";
import { getProductById } from "@/actions/products";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ArrowLeft, Home, Package, MapPin, CreditCard, FileText } from "lucide-react";
import { CancelOrderButton } from "@/components/cancel-order-button";

/**
 * @file app/my/orders/[id]/page.tsx
 * @description 주문 상세 페이지
 *
 * 이 페이지는 특정 주문의 상세 정보를 표시합니다.
 *
 * 주요 기능:
 * 1. 주문 정보 표시
 * 2. 주문 상품 목록 표시
 * 3. 배송지 정보 표시
 * 4. 결제 정보 표시
 * 5. 주문 취소 기능 (pending 상태만)
 *
 * @dependencies
 * - @/actions/orders: getOrderById
 * - @/actions/products: getProductById
 * - @/components/order-status-badge: OrderStatusBadge
 * - @/components/cancel-order-dialog: CancelOrderDialog
 */

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage(
  props: OrderDetailPageProps,
) {
  const { id } = await props.params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const { order, error } = await getOrderById(id);

  if (error || !order) {
    notFound();
  }

  // 주문 상품 이미지 가져오기
  const itemsWithImages = await Promise.all(
    order.items.map(async (item) => {
      const { product } = await getProductById(item.product_id);
      return {
        ...item,
        productImageUrl: product?.image_url || null,
      };
    })
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getOrderIdShort = (orderId: string) => {
    return orderId.substring(0, 8).toUpperCase();
  };

  const canCancel = order.status === "pending" || order.status === "confirmed";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/my/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            주문 내역으로
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">주문 상세</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-muted-foreground">
          주문번호: {getOrderIdShort(order.id)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 왼쪽: 주문 정보 및 상품 목록 */}
        <div className="space-y-6">
          {/* 주문 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                주문 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문번호</span>
                <span className="font-mono font-semibold">
                  {getOrderIdShort(order.id)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문일시</span>
                <span>{formatDateTime(order.created_at)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 상태</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 결제 금액</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 주문 상품 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>주문 상품</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {itemsWithImages.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 last:pb-0">
                  <Link
                    href={`/products/${item.product_id}`}
                    className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border"
                  >
                    <Image
                      src={
                        item.productImageUrl ||
                        "https://via.placeholder.com/400x400?text=No+Image"
                      }
                      alt={item.product_name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>
                  <div className="flex-1 space-y-1">
                    <Link
                      href={`/products/${item.product_id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {item.product_name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity}개
                    </p>
                    <p className="text-sm font-semibold">
                      소계: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 배송지 및 결제 정보 */}
        <div className="space-y-6">
          {/* 배송지 정보 */}
          {order.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  배송지 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">수령인</p>
                  <p className="font-medium">{order.shipping_address.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">연락처</p>
                  <p className="font-medium">{order.shipping_address.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">주소</p>
                  <p className="font-medium">
                    ({order.shipping_address.postal_code}) {order.shipping_address.address}
                    {order.shipping_address.address_detail && (
                      <span className="block mt-1">
                        {order.shipping_address.address_detail}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 결제 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 상품 금액</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 결제 금액</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">결제 일시</p>
                <p className="font-medium">{formatDateTime(order.created_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* 주문 메모 */}
          {order.order_note && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  주문 메모
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.order_note}</p>
              </CardContent>
            </Card>
          )}

          {/* 주문 취소 버튼 */}
          {canCancel && (
            <Card>
              <CardContent className="pt-6">
                <CancelOrderButton orderId={order.id} />
              </CardContent>
            </Card>
          )}

          {/* 액션 버튼 */}
          <div className="flex flex-col gap-3">
            <Button asChild variant="outline">
              <Link href="/my/orders">
                주문 내역으로 돌아가기
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                홈으로 이동
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

