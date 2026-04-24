"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface DeepSeekStreamChunk {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
}

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "你好，我是 AI 编程助手。可以问我算法思路、代码调试、复杂度分析或在线判题相关问题。",
  },
];

const parseStreamLine = (line: string) => {
  if (!line.startsWith("data:")) {
    return "";
  }

  const data = line.replace(/^data:\s*/, "").trim();
  if (!data || data === "[DONE]") {
    return "";
  }

  const payload = JSON.parse(data) as DeepSeekStreamChunk;
  return payload.choices?.[0]?.delta?.content || "";
};

export default function AIChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = input.trim();
    if (!question || isStreaming) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.slice(-20),
        }),
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => null)) as
          | { msg?: string }
          | null;
        throw new Error(payload?.msg || "AI 对话请求失败");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          let content = "";
          try {
            content = parseStreamLine(line.trim());
          } catch {
            continue;
          }

          if (!content) {
            continue;
          }

          setMessages((currentMessages) => {
            const updatedMessages = [...currentMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage?.role === "assistant") {
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + content,
              };
            }
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI 对话失败";
      toast.error(message);
      setMessages((currentMessages) => currentMessages.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-5xl flex-col overflow-hidden rounded-2xl border bg-card shadow-lg shadow-slate-200/70">
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">AI 对话助手</h1>
            <p className="text-sm text-muted-foreground">
              支持 DeepSeek 流式输出，用户和管理员均可使用。
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 px-6 py-5">
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div
              key={`${message.role}-${index}`}
              className={cn("flex gap-3", isUser && "justify-end")}
            >
              {!isUser && (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6",
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {message.content || (
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    思考中...
                  </span>
                )}
              </div>
              {isUser && (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t bg-card p-4">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="输入你的问题，Shift + Enter 换行"
            className="min-h-12 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            rows={2}
            disabled={isStreaming}
          />
          <Button type="submit" disabled={!input.trim() || isStreaming}>
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            发送
          </Button>
        </div>
      </form>
    </div>
  );
}
