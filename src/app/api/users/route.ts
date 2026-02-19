import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/repository/user.repo";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  try {
    const users = await getUsers(limit, offset);
    return NextResponse.json(users);
  } catch (error) {
    console.error("获取用户列表失败:", error);
    return NextResponse.json({ error: "获取用户列表失败" }, { status: 500 });
  }
}
