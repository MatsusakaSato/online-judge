"use client";

import { useState } from "react";
import {
  Users,
  LogOut,
  LucideProps,
  User,
  Home,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Role } from "@/constants/enum";

interface Route {
  label: string;
  href: string;
  icon: React.FC<LucideProps>;
  requiresRole: Role[];
}

const routes: Route[] = [
  {
    label: "首页",
    href: "/",
    icon: Home,
    requiresRole: [],
  },
  {
    label: "用户列表",
    href: "/user-list",
    icon: Users,
    requiresRole: [Role.ADMIN],
  },
  {
    label: "个人中心",
    href: "/profile",
    icon: User,
    requiresRole: [Role.USER, Role.ADMIN],
  },
  {
    label: "创建题目",
    href: "/create-problem",
    icon: PlusCircle,
    requiresRole: [Role.ADMIN],
  },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  const sidebarItems = routes
    .filter((route) => {
      if (route.requiresRole.length === 0) return true;
      return route.requiresRole.some((item) => item === session?.user?.role);
    })
    .map((route) => ({
      title: route.label,
      icon: route.icon,
      path: route.href,
    }));

  const [activeItem, setActiveItem] = useState("首页");

  return (
    <div className="h-full flex flex-col">
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="space-y-4">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <Link href={item.path}>
                <Button
                  variant={activeItem === item.title ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3")}
                  onClick={() => setActiveItem(item.title)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

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
