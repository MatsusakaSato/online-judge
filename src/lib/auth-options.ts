import { getUserByEmail } from "@/repository/user.repo";
import { Role } from "@/constants/enum";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
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
        const user = await getUserByEmail(credentials?.email!);
        if (!user) {
          throw new Error("用户名或密码错误");
        }

        const isValid = await bcrypt.compare(
          credentials?.password!,
          user.password,
        );
        if (!isValid) {
          throw new Error("用户名或密码错误");
        }

        return {
          username: user.username,
          role: user.role,
          email: user.email,
          id: Number(user.id),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = Number(token.id);
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
};
