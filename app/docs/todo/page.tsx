import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckSquare } from "lucide-react";
import { todoContent } from "@/lib/docs/todo-content";

/**
 * @file app/docs/todo/page.tsx
 * @description TODO 문서 페이지
 *
 * 이 페이지는 개발 TODO 목록을 표시합니다.
 * Markdown 형식으로 렌더링되며, 체크박스 상태를 확인할 수 있습니다.
 *
 * @dependencies
 * - react-markdown: Markdown 렌더링
 * - remark-gfm: GitHub Flavored Markdown 지원 (체크박스 포함)
 * - @/lib/docs/todo-content: TODO 문서 내용
 */

export default function TODOPage() {
  const content = todoContent;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CheckSquare className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">개발 TODO</h1>
        </div>
        <p className="text-muted-foreground">
          쇼핑몰 MVP 개발을 위한 작업 목록입니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>쇼핑몰 MVP 개발 TODO</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

