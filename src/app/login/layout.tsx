// app/login/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css"; // 核心：导入全局样式（必加）
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

// 复用根layout的字体配置（保证字体样式一致）
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "登录",
  description: "用户登录",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      {/* 只加载基础样式，不加载侧边栏/导航栏 */}
      <body
        className={cn(
          geistSans.className,
          "min-h-screen bg-background text-foreground flex items-center justify-center p-4",
        )}
      >
        {children} {/* 这里只渲染登录组件，无侧边栏/导航栏 */}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
