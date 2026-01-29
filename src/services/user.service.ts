import { client } from "@/schema/db.client";
import {
  UserInsertModel,
  UserSelectModel,
  userTable,
} from "@/schema/user.schema";
import type { userDTO } from "@/types/dto.types";
import type { UserVO } from "@/types/vo.types";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import * as bcrypt from "bcrypt";
const login = async (user: userDTO): Promise<UserVO> => {
  
  return {
    username: "",
    role: "user",
  };
};
const register = async (user: userDTO): Promise<UserVO> => {
  return await client.transaction(async (tx) => {
    const existingUsers: UserSelectModel[] = await tx
      .select()
      .from(userTable)
      .where(eq(userTable.email, user.email))
      .limit(1);
    if (existingUsers.length !== 0) {
      throw new Error("用户已存在");
    }
    const pwd_hash = await bcrypt.hash(user.password, 10);
    const newUser: UserInsertModel = {
      ...user,
      role: "user",
      password: pwd_hash,
    };
    const ids = await tx.insert(userTable).values(newUser).$returningId();
    if (!ids || ids.length === 0) {
      throw new Error("注册失败");
    }
    const [{ username, role }]: UserSelectModel[] = await tx
      .select()
      .from(userTable)
      .where(eq(userTable.id, ids[0].id));
    return {
      username,
      role,
    };
  });
};
