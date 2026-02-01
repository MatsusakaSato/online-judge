import { Router } from "@/types/router.types";
import { Role } from "@/enum/enum";

const routes: Router[] = [
  {
    key: "home",
    label: "首页",
    href: "/",
    showInMenu: false,
    requiresRole: [],
  },
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
    requiresRole: [Role.ADMIN],
  },
  {
    key: "profile",
    label: "个人中心",
    href: "/profile",
    showInMenu: true,
    requiresRole: [Role.USER, Role.ADMIN],
  },
  {
    key: "login",
    label: "登陆",
    href: "/login",
    showInMenu: false,
    requiresRole: [],
  },
];
export default routes;
