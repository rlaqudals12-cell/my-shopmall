"use server";

/**
 * @file actions/payments.ts
 * @description 결제 관련 Server Actions
 *
 * 이 파일은 Toss Payments 결제 요청 및 승인 처리를 담당합니다.
 * 테스트 환경 및 모의 결제 모드를 지원합니다.
 *
 * 주요 기능:
 * 1. 결제 요청 생성
 * 2. 결제 승인 처리
 * 3. 모의 결제 모드 지원 (API 키 미발급 상황 대응)
 *
 * @dependencies
 * - 환경 변수: NEXT_PUBLIC_TOSS_CLIENT_KEY, TOSS_SECRET_KEY, MOCK_PAYMENT
 */

// 환경 변수는 서버 사이드에서만 접근 가능
const MOCK_PAYMENT = process.env.MOCK_PAYMENT === "true" || process.env.NEXT_PUBLIC_MOCK_PAYMENT === "true";
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

interface CreatePaymentRequestParams {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
}

interface ConfirmPaymentParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/**
 * 결제 요청 생성
 * @param params 결제 요청 파라미터
 * @returns 결제 키 또는 에러 메시지
 */
export async function createPaymentRequest(
  params: CreatePaymentRequestParams
): Promise<{ paymentKey: string | null; error: string | null }> {
  try {
    // 모의 결제 모드
    if (MOCK_PAYMENT) {
      // 모의 결제 키 생성 (테스트용)
      const mockPaymentKey = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return { paymentKey: mockPaymentKey, error: null };
    }

    // 실제 Toss Payments API 호출 (API 키 발급 후 구현)
    if (!TOSS_SECRET_KEY) {
      return {
        paymentKey: null,
        error: "결제 서비스 설정이 필요합니다. 모의 결제 모드를 사용하세요.",
      };
    }

    // TODO: 실제 Toss Payments 결제 요청 API 호출
    // 현재는 API 키 미발급 상황을 고려하여 모의 모드만 지원
    const mockPaymentKey = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return { paymentKey: mockPaymentKey, error: null };
  } catch (error) {
    console.error("Error in createPaymentRequest:", error);
    return {
      paymentKey: null,
      error:
        error instanceof Error ? error.message : "결제 요청 생성에 실패했습니다.",
    };
  }
}

/**
 * 결제 승인 처리
 * @param params 결제 승인 파라미터
 * @returns 승인 성공 여부 및 에러 메시지
 */
export async function confirmPayment(
  params: ConfirmPaymentParams
): Promise<{ success: boolean; error: string | null }> {
  try {
    // 모의 결제 모드
    if (MOCK_PAYMENT) {
      // 모의 결제 승인 (항상 성공)
      return { success: true, error: null };
    }

    // 실제 Toss Payments API 호출 (API 키 발급 후 구현)
    if (!TOSS_SECRET_KEY) {
      return {
        success: false,
        error: "결제 서비스 설정이 필요합니다. 모의 결제 모드를 사용하세요.",
      };
    }

    // TODO: 실제 Toss Payments 결제 승인 API 호출
    // https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
    // 현재는 API 키 미발급 상황을 고려하여 모의 모드만 지원
    return { success: true, error: null };
  } catch (error) {
    console.error("Error in confirmPayment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "결제 승인에 실패했습니다.",
    };
  }
}

