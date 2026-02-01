import { UserDTO } from "@/types/dto.types";
import { client } from "@/schema/db.client";
import { UserInsertModel } from "@/schema/user.schema";
import type { UserVO } from "@/types/vo.types";
import * as bcrypt from "bcrypt";
import { getUserByEmail, createUser } from "@/repository/user.repo";
import { Role } from "@/enum/enum";
export const login = async (userdto: UserDTO): Promise<UserVO> => {
  const user = await getUserByEmail(userdto.email);
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
    const existingUsers = await getUserByEmail(userdto.email);
    if (existingUsers) {
      throw new Error("用户已存在");
    }
    const newUser: UserInsertModel = {
      ...userdto,
      role: Role.USER,
      password: pwd_hash,
    };
    const success = await createUser(newUser);
    if (!success) {
      throw new Error("系统错误");
    }
    const { username, role } = newUser;
    return {
      username,
      role,
    };
  });
};
