import { $UserDTO } from "@/types/dto.types";
import ExceptionHandler from "@/common/ExceptionHandler";
import { NextRequest, NextResponse } from "next/server";
import R from "@/common/ApiResponse";
import { register } from "@/services/user.service";

export const POST = ExceptionHandler(async (req: NextRequest) => {
  const userInfo = await req.json();
  const validation = $UserDTO.safeParse(userInfo);
  if (!validation.success) {
    return NextResponse.json(R.error("数据校验失败"));
  }
  const user = await register(userInfo);
  return NextResponse.json(R.ok("注册成功", user));
});
export const GET = POST;
