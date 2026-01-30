// 导入Next14官方内置的请求/响应处理API（App Router标准导入）
import { NextRequest, NextResponse } from "next/server";
import { UserVO } from "./types/vo.types";
import userStore from "./store/user.store";

/**
 * Next14中间件核心函数
 * @param request - 当前请求对象，包含路径、方法、头信息等
 */
export function middleware(request: NextRequest) {
  // 获取当前请求的完整路径
  const requestPath = request.nextUrl.pathname;
  const user: UserVO | null = userStore.getState().user;
  // 匹配规则：当访问 /login 路径时，执行重定向
  // if (requestPath === "/login") {
  //   // 重定向到根路径 / ，使用307临时重定向（推荐，保留请求方法/体）
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // 非/login路径，直接放行请求（必须返回，否则请求会被阻塞）
  return NextResponse.next();
}
