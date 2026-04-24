"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "@/components/editor/CodeEditor";
import CodeAnalysisPanel from "@/components/problem/CodeAnalysisPanel";
import MdViewComponent from "@/components/markdown/MdViewComponent";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponseResult } from "@/common/ApiResponse";
import { JudgeResultEnum } from "@/constants/enum";
import { SubmissionRecord } from "@/types/judge";
import { CodeAnalysisReport } from "@/types/problemAnalysis";

type ProblemTab = "detail" | "solution" | "analysis" | "submission";

interface ProblemDetailClientProps {
  problemId: number;
  content: string;
  answer: string;
}

const getJudgeBadgeVariant = (status: JudgeResultEnum) => {
  switch (status) {
    case JudgeResultEnum.ACCEPTED:
      return "default";
    case JudgeResultEnum.WAITING:
      return "secondary";
    default:
      return "destructive";
  }
};

const formatSubmissionTime = (value: string) => {
  return new Date(value).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const renderTextBlock = (value?: string) => {
  return value && value.length > 0 ? value : "<empty>";
};

export default function ProblemDetailClient({
  problemId,
  content,
  answer,
}: ProblemDetailClientProps) {
  const [activeTab, setActiveTab] = useState<ProblemTab>("detail");
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [isSubmissionLoading, setIsSubmissionLoading] = useState(false);
  const [isJudging, setIsJudging] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<number | null>(
    null,
  );
  const [analysisReport, setAnalysisReport] = useState<CodeAnalysisReport | null>(
    null,
  );
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadSubmissions = useCallback(async () => {
    setIsSubmissionLoading(true);
    setSubmissionError(null);

    try {
      const response = await fetch(`/api/problems/${problemId}/submissions`, {
        cache: "no-store",
      });
      const result: ResponseResult<SubmissionRecord[]> = await response.json();

      if (!response.ok || result.code !== 0) {
        throw new Error(result.msg || "获取提交记录失败");
      }

      const records = result.data ?? [];
      setSubmissions(records);
      setSubmissionNotice(records.length ? null : result.msg || "暂无提交记录");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "获取提交记录失败";
      setSubmissionError(message);
    } finally {
      setIsSubmissionLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    if (activeTab === "submission") {
      void loadSubmissions();
    }
  }, [activeTab, loadSubmissions]);

  const handleSubmissionStart = useCallback(() => {
    setActiveTab("submission");
    setIsJudging(true);
    setSubmissionError(null);
    setSubmissionNotice("正在调用第三方沙箱判题，请稍候...");
  }, []);

  const handleSubmissionSettled = useCallback(async () => {
    setIsJudging(false);
    setActiveTab("submission");
    await loadSubmissions();
  }, [loadSubmissions]);

  const handleAnalysisStart = useCallback(() => {
    setActiveTab("analysis");
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisReport(null);
  }, []);

  const handleAnalysisComplete = useCallback((report: CodeAnalysisReport) => {
    setIsAnalyzing(false);
    setAnalysisError(null);
    setAnalysisReport(report);
    setActiveTab("analysis");
  }, []);

  const handleAnalysisError = useCallback((message: string) => {
    setIsAnalyzing(false);
    setAnalysisError(message);
    setActiveTab("analysis");
  }, []);

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_30%),linear-gradient(180deg,#f8fafc,#eef2f7)] p-5">
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-full gap-4"
      >
        <ResizablePanel
          defaultSize="50%"
          className="overflow-hidden rounded-2xl border bg-card shadow-xl shadow-slate-200/70"
        >
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ProblemTab)}
            className="h-full"
          >
            <div className="flex items-center justify-between border-b bg-card px-4 py-2">
              <TabsList>
                <TabsTrigger value="detail">题目详情</TabsTrigger>
                <TabsTrigger value="solution">查看题解</TabsTrigger>
                <TabsTrigger value="analysis">代码分析</TabsTrigger>
                <TabsTrigger value="submission">提交记录</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="detail"
              className="h-[calc(100%-64px)] p-4 overflow-auto"
            >
              <MdViewComponent value={content} />
            </TabsContent>
            <TabsContent
              value="solution"
              className="h-[calc(100%-64px)] p-4 overflow-auto"
            >
              {answer ? (
                <MdViewComponent value={answer} />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  题解内容暂未提供
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="analysis"
              className="h-[calc(100%-64px)] p-4 overflow-auto"
            >
              <CodeAnalysisPanel
                report={analysisReport}
                isAnalyzing={isAnalyzing}
                error={analysisError}
              />
            </TabsContent>
            <TabsContent
              value="submission"
              className="h-[calc(100%-64px)] p-4 overflow-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">最近提交</div>
                    <div className="text-xs text-muted-foreground">
                      提交后会自动刷新这里的判题结果
                    </div>
                  </div>
                  {isSubmissionLoading ? (
                    <div className="text-xs text-muted-foreground">刷新中...</div>
                  ) : null}
                </div>

                {isJudging ? (
                  <div className="rounded-lg border bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    正在调用第三方判题沙箱执行代码，请稍候查看结果。
                  </div>
                ) : null}

                {submissionError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submissionError}
                  </div>
                ) : null}

                {!submissionError && !submissions.length ? (
                  <div className="rounded-lg border border-dashed bg-white px-4 py-8 text-center text-sm text-muted-foreground">
                    {submissionNotice || "暂时还没有提交记录"}
                  </div>
                ) : null}

                {submissions.length ? (
                  <div className="rounded-lg border bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>时间</TableHead>
                          <TableHead>语言</TableHead>
                          <TableHead>结果</TableHead>
                          <TableHead>耗时</TableHead>
                          <TableHead>内存</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => {
                          const isExpanded =
                            expandedSubmissionId === submission.id;

                          return (
                            <Fragment key={submission.id}>
                              <TableRow
                                className="cursor-pointer"
                                tabIndex={0}
                                onClick={() =>
                                  setExpandedSubmissionId((current) =>
                                    current === submission.id ? null : submission.id,
                                  )
                                }
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault();
                                    setExpandedSubmissionId((current) =>
                                      current === submission.id
                                        ? null
                                        : submission.id,
                                    );
                                  }
                                }}
                              >
                                <TableCell>{formatSubmissionTime(submission.createdAt)}</TableCell>
                                <TableCell>{submission.language}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getJudgeBadgeVariant(
                                        submission.judgeInfo.status,
                                      )}
                                    >
                                      {submission.judgeInfo.status}
                                    </Badge>
                                    <ChevronDown
                                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                                        isExpanded ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {submission.judgeInfo.time} ms
                                </TableCell>
                                <TableCell>{submission.judgeInfo.memory} KB</TableCell>
                              </TableRow>
                              {isExpanded ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={5}
                                    className="bg-muted/30 px-4 py-4"
                                  >
                                    <div className="space-y-4">
                                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                        <div className="rounded-lg border bg-white px-3 py-2">
                                          <div className="text-xs text-muted-foreground">
                                            判题结果
                                          </div>
                                          <div className="mt-1 font-medium">
                                            {submission.judgeInfo.status}
                                          </div>
                                        </div>
                                        <div className="rounded-lg border bg-white px-3 py-2">
                                          <div className="text-xs text-muted-foreground">
                                            通过用例
                                          </div>
                                          <div className="mt-1 font-medium">
                                            {submission.judgeInfo.passedCases ?? 0}/
                                            {submission.judgeInfo.totalCases ?? 0}
                                          </div>
                                        </div>
                                        <div className="rounded-lg border bg-white px-3 py-2">
                                          <div className="text-xs text-muted-foreground">
                                            执行耗时
                                          </div>
                                          <div className="mt-1 font-medium">
                                            {submission.judgeInfo.time} ms
                                          </div>
                                        </div>
                                        <div className="rounded-lg border bg-white px-3 py-2">
                                          <div className="text-xs text-muted-foreground">
                                            占用内存
                                          </div>
                                          <div className="mt-1 font-medium">
                                            {submission.judgeInfo.memory} KB
                                          </div>
                                        </div>
                                      </div>

                                      <div className="rounded-lg border bg-white px-4 py-3">
                                        <div className="text-sm font-medium">
                                          详情信息
                                        </div>
                                        <div className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground">
                                          {submission.judgeInfo.message ||
                                            "本次提交没有额外详情信息。"}
                                        </div>
                                      </div>

                                      {submission.judgeInfo.failedCase ? (
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                          <div className="flex items-center justify-between gap-3">
                                            <div className="text-sm font-semibold text-red-700">
                                              未通过样例 #{submission.judgeInfo.failedCase.caseIndex}
                                            </div>
                                            <Badge
                                              variant="destructive"
                                              className="shadow-none"
                                            >
                                              失败样例
                                            </Badge>
                                          </div>
                                          <div className="mt-3 grid gap-3 lg:grid-cols-3">
                                            <div className="rounded-md border border-red-200 bg-white px-3 py-2">
                                              <div className="text-xs font-medium text-red-600">
                                                输入
                                              </div>
                                              <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs text-foreground">
                                                {renderTextBlock(
                                                  submission.judgeInfo.failedCase
                                                    .input,
                                                )}
                                              </pre>
                                            </div>
                                            <div className="rounded-md border border-red-200 bg-white px-3 py-2">
                                              <div className="text-xs font-medium text-red-600">
                                                预期输出
                                              </div>
                                              <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs text-foreground">
                                                {renderTextBlock(
                                                  submission.judgeInfo.failedCase
                                                    .expectedOutput,
                                                )}
                                              </pre>
                                            </div>
                                            <div className="rounded-md border border-red-200 bg-white px-3 py-2">
                                              <div className="text-xs font-medium text-red-600">
                                                实际输出 / 错误信息
                                              </div>
                                              <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs text-foreground">
                                                {renderTextBlock(
                                                  submission.judgeInfo.failedCase
                                                    .actualOutput ||
                                                    submission.judgeInfo
                                                      .failedCase.errorOutput,
                                                )}
                                              </pre>
                                            </div>
                                          </div>
                                        </div>
                                      ) : null}

                                      <div className="rounded-lg border bg-slate-950 text-slate-50">
                                        <div className="border-b border-slate-800 px-4 py-2 text-sm font-medium">
                                          提交代码
                                        </div>
                                        <pre className="max-h-80 overflow-auto px-4 py-3 font-mono text-xs leading-6">
                                          <code>{submission.code}</code>
                                        </pre>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : null}
                            </Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : null}
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-transparent" />
        <ResizablePanel
          defaultSize="50%"
          className="overflow-hidden rounded-2xl border bg-card shadow-xl shadow-slate-200/70"
        >
          <CodeEditor
            problemId={problemId}
            onSubmissionStart={handleSubmissionStart}
            onSubmissionSettled={handleSubmissionSettled}
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisError={handleAnalysisError}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
