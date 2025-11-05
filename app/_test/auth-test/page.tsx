"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Auth Test Page - 빌드 에러 방지를 위해 간소화
 * 
 * 이 페이지는 테스트용이며, 빌드 타임 환경 변수 체크를 방지하기 위해
 * Supabase 클라이언트를 사용하지 않도록 수정되었습니다.
 */
export default function AuthTestPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold mb-2">
          Clerk + Supabase 인증 연동 테스트
        </h1>
        <p className="text-gray-600">
          이 페이지는 테스트용입니다. 환경 변수 설정 후 사용하세요.
        </p>
      </div>

      <div className="p-6 border rounded-lg bg-yellow-50">
        <h2 className="text-xl font-bold mb-2">⚠️ 테스트 페이지 비활성화</h2>
        <p className="text-gray-700 mb-4">
          빌드 에러를 방지하기 위해 이 페이지는 간소화되었습니다.
          로컬 개발 환경에서 환경 변수를 설정한 후 사용하세요.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}
