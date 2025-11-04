import { z } from "zod";

/**
 * @file lib/validations/checkout.ts
 * @description 결제 페이지 배송지 입력 폼 유효성 검사 스키마
 *
 * 이 파일은 결제 페이지에서 사용되는 배송지 입력 폼의 유효성 검사를 정의합니다.
 * Zod 스키마를 사용하여 타입 안전성을 보장합니다.
 *
 * @dependencies
 * - zod: 스키마 검증 라이브러리
 */

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(2, "수령인 이름은 최소 2자 이상이어야 합니다.")
    .max(50, "수령인 이름은 최대 50자까지 입력 가능합니다."),
  phone: z
    .string()
    .regex(
      /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
      "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)"
    ),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "우편번호는 5자리 숫자여야 합니다."),
  address: z.string().min(1, "주소를 입력해주세요."),
  addressDetail: z.string().optional(),
  orderNote: z
    .string()
    .max(500, "주문 메모는 최대 500자까지 입력 가능합니다.")
    .optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

