import type { Router } from "@/types/router.types";

const routes: Router[] = [
  // 1. 仪表盘（核心页，仅管理员可见，显示在侧边栏，需要认证）
  {
    key: "dashboard",
    label: "仪表盘",
    href: "/dashboard",
    showInMenu: true, // 显示在侧边栏菜单
    meta: {
      requiresAuth: true, // 需要登录
      requiresRole: ["admin"], // 仅管理员可访问
    },
  },

  // 2. 团队管理（带2个子路由，管理员/编辑可见，显示在侧边栏）
  {
    key: "team",
    label: "团队管理",
    href: "/team",
    showInMenu: true,
    meta: {
      requiresAuth: true,
      requiresRole: ["admin"], // 管理员/编辑可访问
    },
    children: [
      {
        key: "team-list",
        label: "团队列表",
        href: "/team/list",
        showInMenu: true,
        meta: {
          requiresAuth: true,
          requiresRole: ["admin"],
        },
      },
      {
        key: "team-create",
        label: "创建团队",
        href: "/team/create",
        showInMenu: true,
        meta: {
          requiresAuth: true,
          requiresRole: ["admin"], // 仅管理员可创建
        },
      },
    ],
  },

  // 3. 个人中心（所有登录用户可见，显示在侧边栏）
  {
    key: "profile",
    label: "个人中心",
    href: "/profile",
    showInMenu: true,
    meta: {
      requiresAuth: true, // 需要登录
      requiresRole: ["admin", "user"], // 所有登录角色均可访问
    },
  },

  // 4. 登录页（无需认证，不显示在侧边栏）
  {
    key: "login",
    label: "登录",
    href: "/login",
    showInMenu: false, // 不显示在侧边栏菜单
    meta: {
      requiresAuth: false, // 无需登录（登录页本身不需要认证）
      requiresRole: [], // 游客（未登录）可访问
    },
  },

  // 5. 系统设置（带子路由，仅管理员可见，显示在侧边栏）
  {
    key: "settings",
    label: "系统设置",
    href: "/settings",
    showInMenu: true,
    meta: {
      requiresAuth: true,
      requiresRole: ["admin"],
    },
    children: [
      {
        key: "settings-account",
        label: "账号设置",
        href: "/settings/account",
        showInMenu: true,
        meta: {
          requiresAuth: true,
          requiresRole: ["admin"],
        },
      },
      {
        key: "settings-security",
        label: "安全设置",
        href: "/settings/security",
        showInMenu: true,
        meta: {
          requiresAuth: true,
          requiresRole: ["admin"],
        },
      },
    ],
  },
];
export default routes;
