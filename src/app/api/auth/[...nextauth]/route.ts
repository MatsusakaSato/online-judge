import { getUserByEmail } from "@/repository/user.repo";
import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import { Role } from "@/enum/enum";

const handler = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "邮箱", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        // 检查 credentials 是否包含 email 和 password
        if (!credentials?.email || !credentials?.password) {
          throw new Error("邮箱或密码不能为空");
        }
        const user = await getUserByEmail(credentials?.email);
        //用户不存在
        if (!user) {
          throw new Error("用户不存在");
        }
        const isValid = await bcrypt.compare(
          credentials?.password,
          user.password,
        );
        //用户存在但是密码不对
        if (!isValid) {
          throw new Error("用户名或密码错误");
        }
        return {
          username: user.username,
          role: user.role,
          email: user.email,
          id: user.id.toString(),
        };
      },
    }),
  ],
  callbacks: {
    // 1. 当 JWT 令牌创建或更新时调用
    // user 参数仅在登录时可用，之后该信息存储在 token 中
    async jwt({ token, user }) {
      if (user) {
        // 将 authorize 返回的自定义字段存入 token
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },

    // 2. 当客户端请求 session 时调用
    // 负责将 token 中的内容同步到前端可见的 session 对象中
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
