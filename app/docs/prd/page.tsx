import { readFile } from "fs/promises";
import { join } from "path";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText } from "lucide-react";

/**
 * @file app/docs/prd/page.tsx
 * @description PRD (Product Requirements Document) 문서 페이지
 *
 * 이 페이지는 프로젝트 요구사항 문서를 표시합니다.
 * Markdown 형식으로 렌더링됩니다.
 *
 * @dependencies
 * - react-markdown: Markdown 렌더링
 * - remark-gfm: GitHub Flavored Markdown 지원
 */

export default async function PRDPage() {
  // Markdown 파일 읽기
  let content: string;
  
  // 여러 가능한 경로 시도
  const possiblePaths = [
    join(process.cwd(), "docs", "prd.md"),
    join(process.cwd(), "..", "docs", "prd.md"),
  ];
  
  let fileRead = false;
  for (const filePath of possiblePaths) {
    try {
      content = await readFile(filePath, "utf-8");
      fileRead = true;
      break;
    } catch {
      continue;
    }
  }
  
  if (!fileRead) {
    content = "# 문서를 불러올 수 없습니다\n\n파일 경로를 확인해주세요.";
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">프로젝트 요구사항 문서 (PRD)</h1>
        </div>
        <p className="text-muted-foreground">
          쇼핑몰 MVP 개발을 위한 프로젝트 요구사항 문서입니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>쇼핑몰 1차 MVP - PRD</CardTitle>
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

