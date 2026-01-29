import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

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
  title: "Online Judge",
  description: "在线编程测评平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.className,
          "min-h-screen bg-background text-foreground m-0 p-0", // 清除默认边距
        )}
      >
        {/* 核心修改：纯Grid布局实现固定Header+Sidebar，移除所有fixed定位 */}
        <div className="grid grid-cols-[200px_1fr] grid-rows-[64px_1fr] h-screen w-full overflow-hidden">
          {/* 顶部导航栏：跨2列，高度64px，无需fixed */}
          <header className="col-span-2 row-span-1 bg-card border-b z-10">
            <Header />
          </header>

          {/* 侧边栏：仅占第一列，高度100% - 64px，无需fixed */}
          <aside className="col-span-1 row-span-2 bg-card border-r z-10 overflow-y-auto">
            <Sidebar />
          </aside>

          {/* 主内容区：仅占第二列，移除ml-60/mt-16，用Grid自动定位 */}
          <main className="col-span-1 row-span-2 overflow-y-auto bg-muted/20">
            {/* 内容容器：确保Footer自适应贴底 */}
            <div className="min-h-full flex flex-col px-6 py-4">
              {/* page.tsx的内容会渲染到这里 */}
              <div className="flex-1 flex flex-col">{children}</div>

              <footer className="mt-auto py-4 border-t bg-card">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                  © 2026 Online Judge | Built with Next.js
                </div>
              </footer>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
