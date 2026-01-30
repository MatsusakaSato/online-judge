import type { Router } from "@/types/router.types";

const routes: Router[] = [
  {
    key: "problemList",
    label: "题目列表",
    href: "/problems",
    showInMenu: true,
    meta: {
      requiresAuth: false,
      requiresRole: [],
    },
  },
  {
    key: "userList",
    label: "用户列表",
    href: "/users",
    showInMenu: true,
    meta: {
      requiresAuth: true,
      requiresRole: ["admin"],
    },
  },
];
export default routes;
