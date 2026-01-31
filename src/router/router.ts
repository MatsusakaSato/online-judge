import { Router } from "@/types/router.types";

const routes = [
  {
    key: "problemList",
    label: "题目列表",
    href: "/problems",
    showInMenu: true,
    requiresRole: [],
  },
  {
    key: "userList",
    label: "用户列表",
    href: "/users",
    showInMenu: true,
    requiresRole: ["admin"],
  },
  {
    key: "profile",
    label: "个人中心",
    href: "/profile",
    showInMenu: true,
    requiresRole: ["user", "admin"],
  },
] as const satisfies Router[];
export default routes;
