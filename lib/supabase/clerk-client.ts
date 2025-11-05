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
    // 빌드 타임 체크 완전 방지: 항상 기본값 사용
    // 런타임에만 실제 환경 변수 사용
    const supabaseUrl = 
      typeof window !== "undefined" 
        ? (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co")
        : "https://placeholder.supabase.co";
    const supabaseKey = 
      typeof window !== "undefined"
        ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key")
        : "placeholder-key";

    return createClient(supabaseUrl, supabaseKey, {
      async accessToken() {
        return (await getToken()) ?? null;
      },
    });
  }, [getToken]);

  return supabase;
}
