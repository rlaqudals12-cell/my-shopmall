"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/checkout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * @file components/checkout-form.tsx
 * @description 배송지 입력 폼 컴포넌트
 *
 * 이 컴포넌트는 결제 페이지에서 사용되는 배송지 입력 폼을 제공합니다.
 * react-hook-form과 Zod를 사용하여 유효성 검사를 수행합니다.
 *
 * @dependencies
 * - react-hook-form: 폼 상태 관리
 * - @hookform/resolvers: Zod 스키마 리졸버
 * - @/lib/validations/checkout: checkoutSchema
 */

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export function CheckoutForm({ onSubmit, isLoading = false }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">배송지 정보</h2>

        {/* 수령인 이름 */}
        <div className="space-y-2">
          <Label htmlFor="name">
            수령인 이름 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="홍길동"
            disabled={isLoading}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* 연락처 */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            연락처 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="010-1234-5678"
            disabled={isLoading}
            aria-invalid={errors.phone ? "true" : "false"}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* 우편번호 */}
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            우편번호 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postalCode"
            {...register("postalCode")}
            placeholder="12345"
            maxLength={5}
            disabled={isLoading}
            aria-invalid={errors.postalCode ? "true" : "false"}
          />
          {errors.postalCode && (
            <p className="text-sm text-destructive">{errors.postalCode.message}</p>
          )}
        </div>

        {/* 기본 주소 */}
        <div className="space-y-2">
          <Label htmlFor="address">
            기본 주소 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="서울시 강남구 테헤란로 123"
            disabled={isLoading}
            aria-invalid={errors.address ? "true" : "false"}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* 상세 주소 */}
        <div className="space-y-2">
          <Label htmlFor="addressDetail">상세 주소</Label>
          <Input
            id="addressDetail"
            {...register("addressDetail")}
            placeholder="101호 (선택사항)"
            disabled={isLoading}
          />
        </div>

        {/* 주문 메모 */}
        <div className="space-y-2">
          <Label htmlFor="orderNote">주문 메모</Label>
          <Textarea
            id="orderNote"
            {...register("orderNote")}
            placeholder="배송 시 요청사항을 입력해주세요. (선택사항)"
            rows={3}
            disabled={isLoading}
            className="resize-none"
          />
          {errors.orderNote && (
            <p className="text-sm text-destructive">{errors.orderNote.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
          {isLoading ? "주문 생성 중..." : "주문하기"}
        </Button>
      </div>
    </form>
  );
}

