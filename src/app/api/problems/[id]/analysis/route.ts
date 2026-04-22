import { NextResponse } from "next/server";
import { z } from "zod";
import { R } from "@/common/ApiResponse";
import { Language } from "@/constants/enum";
import { getProblemById } from "@/repository/problem.repo";
import { CodeAnalysisReport } from "@/types/problemAnalysis";

export const runtime = "nodejs";

interface RouteContext {
  params: {
    id: string;
  };
}

const analysisRequestSchema = z.object({
  code: z.string().trim().min(1, "代码不能为空").max(20000, "代码过长，请缩短后重试"),
  language: z
    .string()
    .refine((value): value is Language => Object.values(Language).includes(value as Language), {
      message: "提交语言不受支持",
    })
    .transform((value) => value as Language),
});

const analysisReportSchema = z.object({
  summary: z.string().trim().min(1),
  correctness: z.string().trim().min(1),
  complexity: z.string().trim().min(1),
  style: z.string().trim().min(1),
  optimization: z.string().trim().min(1),
  naming: z.string().trim().min(1),
});

interface DeepSeekChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

const clipText = (value: string | null | undefined, limit: number) => {
  if (!value) {
    return "";
  }

  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit)}\n\n[内容过长，已截断]`;
};

const buildMessages = ({
  title,
  content,
  answer,
  code,
  language,
}: {
  title: string;
  content: string;
  answer: string;
  code: string;
  language: Language;
}) => {
  return [
    {
      role: "system",
      content: `你是在线判题平台中的资深代码评审助手。你需要结合题目、题解和用户代码，生成简短、准确、可执行的分析报告。

你必须遵循这些要求：
1. 只输出 JSON，不要输出 Markdown，不要输出代码块，不要输出额外解释。
2. 输出字段必须严格为 summary、correctness、complexity、style、optimization、naming。
3. 每个字段都使用简体中文，保持简短具体，适合直接展示给用户。
4. 如果官方题解缺失或信息不足，请基于题目合理推断，并在正确性或复杂度中明确说明不确定性。
5. complexity 需要同时提到时间复杂度和空间复杂度；如果无法精确判断，就给出最可能的复杂度并说明原因。
6. optimization 优先指出 1 到 2 个最值得改的点。
7. naming 重点评价变量、函数、类名是否清晰规范。

输出 JSON 示例：
{
  "summary": "一句话总体结论",
  "correctness": "是否符合题意、是否有边界风险",
  "complexity": "时间复杂度 O(...)，空间复杂度 O(...)，并说明依据",
  "style": "评价代码结构、可读性和风格一致性",
  "optimization": "最值得做的优化建议",
  "naming": "命名是否清晰，有哪些可改进之处"
}`,
    },
    {
      role: "user",
      content: `请分析下面这份代码。

题目标题：
${title}

题目内容：
${clipText(content, 12000)}

官方题解：
${answer ? clipText(answer, 10000) : "暂无官方题解，请基于题目推断。"}

代码语言：
${language}

用户代码：
${clipText(code, 12000)}`,
    },
  ];
};

const parseDeepSeekContent = (content: string): CodeAnalysisReport => {
  const parsed = JSON.parse(content) as unknown;
  return analysisReportSchema.parse(parsed);
};

export async function POST(request: Request, { params }: RouteContext) {
  const problemId = Number(params.id);

  if (!Number.isInteger(problemId) || problemId <= 0) {
    return NextResponse.json(R.error("题目 ID 无效"), { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(R.error("DeepSeek API Key 未配置"), {
      status: 500,
    });
  }

  try {
    const rawBody = await request.json();
    const body = analysisRequestSchema.parse(rawBody);
    const problem = await getProblemById(problemId);

    if (!problem) {
      return NextResponse.json(R.error("题目不存在"), { status: 404 });
    }

    const response = await fetch(
      process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
          temperature: 0.2,
          max_tokens: 900,
          response_format: {
            type: "json_object",
          },
          messages: buildMessages({
            title: problem.title,
            content: problem.content || "",
            answer: problem.answer || "",
            code: body.code,
            language: body.language,
          }),
        }),
      },
    );

    const payload = (await response.json()) as DeepSeekChatCompletionResponse;

    if (!response.ok) {
      const message =
        payload.error?.message || "调用 DeepSeek 失败，请稍后重试";
      return NextResponse.json(R.error(message), { status: response.status });
    }

    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(R.error("DeepSeek 未返回分析结果"), {
        status: 502,
      });
    }

    const report = parseDeepSeekContent(content);
    return NextResponse.json(R.ok("代码分析完成", report));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        R.error(error.issues[0]?.message || "请求参数不合法"),
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(R.error("DeepSeek 返回结果解析失败"), {
        status: 502,
      });
    }

    console.error("Error analyzing code:", error);
    return NextResponse.json(R.error("代码分析失败，请稍后重试"), {
      status: 500,
    });
  }
}
