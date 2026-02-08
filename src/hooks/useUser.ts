import { useSession } from "next-auth/react";

export default function useUser() {
  const { data: session, status, update } = useSession();
  return {
    // 基础数据
    username: session?.user?.username ?? undefined,
    email: session?.user?.email ?? undefined,
    role: session?.user?.role,
    id: session?.user?.id,

    // 状态判断
    isLoading: status === "loading",
    isLoggedIn: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",

    // 手动刷新 Session 的方法（用于更新个人资料后同步 UI）
    refresh: update,
  };
}
