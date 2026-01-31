// components/layout/Header.tsx
"use client";

import { Search, Code2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import userStore from "@/store/user.store";
import Link from "next/link";

export default function Header() {
  const user = userStore((state) => state.user);
  return (
    <div className="h-full px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-1.5 rounded-lg">
          <Code2 className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold">Online-judge</h1>
      </div>

      {/* 中间：搜索框（仅大屏显示） */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 w-full bg-muted" />
        </div>
      </div>

      {/* 右侧：通知 + 用户头像 */}
      <div className="flex items-center gap-4 px-6">
        <Avatar className="h-8 w-8">
          <img src="https://picsum.photos/200/200" alt="User avatar" />
        </Avatar>
        {/* 用户名文本：大屏显示，小屏隐藏，防止占空间 */}
        <Link href={"/login"}>
          <span className="text-base font-medium hidden md:inline-block">
            {user?.username ?? "未登录"}
          </span>
        </Link>
      </div>
    </div>
  );
}
