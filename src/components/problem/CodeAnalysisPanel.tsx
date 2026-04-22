"use client";

import { CodeAnalysisReport } from "@/types/problemAnalysis";

interface CodeAnalysisPanelProps {
  report: CodeAnalysisReport | null;
  isAnalyzing: boolean;
  error: string | null;
}

const reportSections: Array<{
  key: keyof CodeAnalysisReport;
  title: string;
}> = [
  { key: "summary", title: "总体结论" },
  { key: "correctness", title: "正确性" },
  { key: "complexity", title: "时空复杂度" },
  { key: "style", title: "代码风格" },
  { key: "optimization", title: "可优化点" },
  { key: "naming", title: "命名规范" },
];

export default function CodeAnalysisPanel({
  report,
  isAnalyzing,
  error,
}: CodeAnalysisPanelProps) {
  if (isAnalyzing) {
    return (
      <div className="rounded-lg border bg-white px-4 py-8 text-center text-sm text-muted-foreground">
        正在结合题目、题解和当前代码生成分析报告，请稍候...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-lg border border-dashed bg-white px-4 py-8 text-center text-sm text-muted-foreground">
        点击右侧编辑器下方的“AI 分析”按钮后，这里会生成简短的代码分析报告。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reportSections.map((section) => (
        <div key={section.key} className="rounded-lg border bg-white px-4 py-4">
          <div className="text-sm font-medium">{section.title}</div>
          <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
            {report[section.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
