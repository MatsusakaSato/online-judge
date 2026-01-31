// components/layout/Sidebar.tsx
"use client";

import { useState } from "react";
import { Users, LogOut, Menu, LucideProps, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import routes from "@/router/router";
import userStore from "@/store/user.store";

export default function Sidebar() {
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);
  const logout = () => {
    setUser(null);
  };

  const iconMap: Record<
    (typeof routes)[number]["key"],
    React.FC<LucideProps>
  > = {
    problemList: Menu,
    userList: Users,
    profile: User,
  };
  const sidebarItems = routes
    .filter((route) => route.showInMenu === true)
    .filter((route) => {
      if (route.requiresRole.length === 0) return true;
      return route.requiresRole.some((item) => item === user?.role);
    })
    .map((route) => ({
      title: route.label,
      icon: iconMap[route.key] || Menu,
      path: route.href,
    }));

  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="h-full flex flex-col">
      {/* 侧边栏菜单 */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="space-y-4">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <Button
                variant={activeItem === item.title ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3")}
                onClick={() => setActiveItem(item.title)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 侧边栏底部 */}
      <div className="px-4 py-4 border-t">
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3")}
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
