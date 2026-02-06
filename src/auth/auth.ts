import * as userRepo from "@/repository/user.repo";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          return null;
        }
        const user = await userRepo.getUserByEmail(email);
        //用户不存在
        if (!user) {
          return null;
        }
        const isValid = await bcrypt.compare(password, user.password);
        //用户存在但是密码不对
        if (!isValid) {
          return null;
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
  session: { strategy: "jwt" },
});
