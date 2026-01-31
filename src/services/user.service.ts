import { UserDTO } from "@/types/dto.types";
import { client } from "@/schema/db.client";
import { UserInsertModel, userTable } from "@/schema/user.schema";
import type { UserVO } from "@/types/vo.types";
import { and, eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
export const login = async (userdto: UserDTO): Promise<UserVO> => {
  const user = await client.query.userTable.findFirst({
    where: and(eq(userTable.email, userdto.email)),
    columns: {
      username: true,
      role: true,
      password: true,
    },
  });
  //用户不存在
  if (!user) {
    throw new Error("用户名或密码错误");
  }
  const isValid = await bcrypt.compare(userdto.password, user.password);
  //用户存在但是密码不对
  if (!isValid) {
    throw new Error("用户名或密码错误");
  }
  const { username, role } = user;
  return {
    username,
    role,
  };
};
export const register = async (userdto: UserDTO): Promise<UserVO> => {
  const pwd_hash = await bcrypt.hash(userdto.password, bcrypt.genSaltSync());
  return await client.transaction(async (tx) => {
    const existingUsers = await tx.query.userTable.findFirst({
      where: eq(userTable.email, userdto.email),
      columns: { id: true },
    });
    if (existingUsers) {
      throw new Error("用户已存在");
    }
    const newUser: UserInsertModel = {
      ...userdto,
      role: "user",
      password: pwd_hash,
    };
    const ids = await tx.insert(userTable).values(newUser).$returningId();
    if (!ids || ids.length === 0) {
      throw new Error("注册失败");
    }
    const user = await tx.query.userTable.findFirst({
      where: eq(userTable.id, ids[0].id),
      columns: {
        username: true,
        role: true,
      },
    });
    if (!user) {
      throw new Error("系统错误");
    }
    const { username, role } = user;
    return {
      username,
      role,
    };
  });
};
