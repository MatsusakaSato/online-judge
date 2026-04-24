import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { R } from "@/common/ApiResponse";
import { authOptions } from "@/lib/auth-options";

export const runtime = "nodejs";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(8000),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(R.error("请先登录后再使用 AI 对话"), {
      status: 401,
    });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(R.error("DeepSeek API Key 未配置"), {
      status: 500,
    });
  }

  try {
    const rawBody = await request.json();
    const body = chatRequestSchema.parse(rawBody);

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
          temperature: 0.7,
          max_tokens: 2048,
          stream: true,
          messages: [
            {
              role: "system",
              content:
                "你是 Online Judge 平台的 AI 编程助手。请使用简体中文回答，优先帮助用户理解算法、调试代码、分析复杂度和改进解题思路。不要替用户提交答案，必要时给出循序渐进的提示。",
            },
            ...body.messages,
          ],
        }),
      },
    );

    if (!response.ok || !response.body) {
      let message = "调用 DeepSeek 失败，请稍后重试";
      try {
        const payload = (await response.json()) as { error?: { message?: string } };
        message = payload.error?.message || message;
      } catch {
        // ignore non-json errors from provider
      }
      return NextResponse.json(R.error(message), { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        R.error(error.issues[0]?.message || "请求参数不合法"),
        { status: 400 },
      );
    }

    console.error("Error chatting with DeepSeek:", error);
    return NextResponse.json(R.error("AI 对话失败，请稍后重试"), {
      status: 500,
    });
  }
}
