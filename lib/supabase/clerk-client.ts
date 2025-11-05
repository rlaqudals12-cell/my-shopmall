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
    // 클라이언트에서만 환경 변수 체크 (빌드 타임 체크 방지)
    if (typeof window === "undefined") {
      // 서버 사이드에서는 더미 클라이언트 반환 (빌드 타임 방지)
      return createClient("https://placeholder.supabase.co", "placeholder-key", {
        async accessToken() {
          return null;
        },
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Debug: 출력은 민감정보 노출 방지를 위해 길이만 표시
    console.log(
      "[EnvCheck] SUPABASE_URL exists:",
      Boolean(supabaseUrl),
      "| ANON_KEY length:",
      supabaseKey?.length ?? 0,
    );

    if (!supabaseUrl) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL 이(가) 설정되지 않았습니다. 프로젝트 루트 .env 파일을 확인하세요.",
      );
    }
    if (!supabaseKey) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY 이(가) 설정되지 않았습니다. 프로젝트 루트 .env 파일을 확인하세요.",
      );
    }

    return createClient(supabaseUrl, supabaseKey, {
      async accessToken() {
        return (await getToken()) ?? null;
      },
    });
  }, [getToken]);

  return supabase;
}
