import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@/enum/enum";

declare module "next-auth" {
  // 1. 扩展 User 接口：解决 authorize 返回值的类型问题
  interface User extends DefaultUser {
    id: number;
    username: string;
    role: Role.ADMIN | Role.USER;
  }

  // 2. 扩展 Session 接口：解决 useSession() 调用的类型问题
  interface Session {
    user: {
      id: number;
      username: string;
      role: Role.ADMIN | Role.USER;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // 3. 扩展 JWT 接口：解决 jwt 回调中 token 变量的类型问题
  interface JWT {
    id: number;
    username: string;
    role: Role.ADMIN | Role.USER;
  }
}
