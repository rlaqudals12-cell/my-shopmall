import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @file app/docs/page.tsx
 * @description 문서 목록 페이지
 *
 * 이 페이지는 사용 가능한 문서 목록을 표시합니다.
 */

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">문서</h1>
        <p className="text-muted-foreground">
          프로젝트 관련 문서를 확인하실 수 있습니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>프로젝트 요구사항 문서 (PRD)</CardTitle>
            </div>
            <CardDescription>
              쇼핑몰 MVP 개발을 위한 프로젝트 요구사항 문서입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/docs/prd">
                문서 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckSquare className="h-6 w-6 text-primary" />
              <CardTitle>개발 TODO</CardTitle>
            </div>
            <CardDescription>
              쇼핑몰 MVP 개발을 위한 작업 목록입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/docs/todo">
                문서 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

