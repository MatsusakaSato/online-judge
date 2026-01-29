// components/layout/Sidebar.tsx
"use client";

import { useState } from "react";
import {
  Home,
  Settings,
  Users,
  LogOut,
  User,
  LogIn,
  Menu,
  LucideProps,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import routes from "@/router/router";

const iconMap: Record<string, React.FC<LucideProps>> = {
  dashboard: Home,
  team: Users,
  profile: User,
  login: LogIn,
  settings: Settings,
};
const sidebarItems = routes
  .filter((route) => route.showInMenu === true)
  .map((route) => ({
    title: route.label,
    icon: iconMap[route.key] || Menu,
    path: route.href,
  }));
export default function Sidebar() {
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
        <Button variant="ghost" className={cn("w-full justify-start gap-3")}>
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
