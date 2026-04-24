"use client";
// src/components/layout/MainLayout.tsx
import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SessionProvider } from "next-auth/react";

// 接收子元素作为props，类型为ReactNode
interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SessionProvider>
      <div className="grid h-screen w-full grid-cols-[220px_1fr] grid-rows-[64px_1fr] overflow-hidden bg-slate-100 text-foreground">
        {/* 顶部导航栏：跨2列，高度64px */}
        <header className="col-span-2 row-span-1 z-20 border-b bg-card/95 shadow-sm backdrop-blur">
          <Header />
        </header>

        {/* 侧边栏：仅占第一列，纵向跨2行 */}
        <aside className="col-span-1 row-span-2 z-10 overflow-y-auto border-r bg-card/95 shadow-sm scrollbar-hide">
          <Sidebar />
        </aside>

        {/* 主内容区：仅占第二列，纵向跨2行，包含页脚自适应逻辑 */}
        <main className="relative z-10 col-span-1 row-span-2 flex min-h-0 flex-col bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_30%),linear-gradient(180deg,#f8fafc,#eef2f7)] p-5">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-background/95 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-hide">
              <div className="min-h-full">{children}</div>
            </div>
            <footer className="border-t bg-card/80 px-6 py-3">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                © 2026 Online Judge | Built with Next.js
              </div>
            </footer>
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
