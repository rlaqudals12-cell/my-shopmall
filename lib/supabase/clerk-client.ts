"use client";

import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - useAuth().getToken()으로 현재 세션 토큰 사용
 * - React Hook으로 제공되어 Client Component에서 사용
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 *
 * export default function MyComponent() {
 *   const supabase = useClerkSupabaseClient();
 *
 *   async function fetchData() {
 *     const { data } = await supabase.from('table').select('*');
 *     return data;
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { getToken } = useAuth();

  const supabase = useMemo(() => {
    // 빌드 타임 체크 방지: 항상 더미 클라이언트를 먼저 생성
    // 실제 환경 변수는 런타임에만 체크
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

    return createClient(supabaseUrl, supabaseKey, {
      async accessToken() {
        return (await getToken()) ?? null;
      },
    });
  }, [getToken]);

  // 클라이언트에서만 환경 변수 유효성 검사 (실제 사용 시점에 체크)
  if (typeof window !== "undefined") {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Debug: 출력은 민감정보 노출 방지를 위해 길이만 표시
    console.log(
      "[EnvCheck] SUPABASE_URL exists:",
      Boolean(supabaseUrl),
      "| ANON_KEY length:",
      supabaseKey?.length ?? 0,
    );

    // 실제 사용 시점에만 에러 발생 (빌드 타임 방지)
    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요."
      );
    }
  }

  return supabase;
}
