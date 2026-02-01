"use server";
import { UserDTO } from "@/types/dto.types";
import { UserInsertModel } from "@/schema/user.schema";
import type { UserVO } from "@/types/vo.types";
import * as bcrypt from "bcrypt";
import { userRepo } from "@/repository/user.repo";
import { Role } from "@/enum/enum";
import { R, ResponseResult } from "@/common/ApiResponse";
export const loginAction = async (
  userdto: UserDTO,
): Promise<ResponseResult<UserVO>> => {
  const user = await userRepo.getUserByEmail(userdto.email);
  //用户不存在
  if (!user) {
    return R.error("用户名或密码错误");
  }
  const isValid = await bcrypt.compare(userdto.password, user.password);
  //用户存在但是密码不对
  if (!isValid) {
    return R.error("用户名或密码错误");
  }
  const { username, role } = user;
  return R.ok("登陆成功", { role, username });
};
export const registerAction = async (
  userdto: UserDTO,
): Promise<ResponseResult<UserVO>> => {
  const existingUsers = await userRepo.getUserByEmail(userdto.email);

  if (existingUsers) {
    return R.error("用户已存在");
  }
  const pwd_hash = await bcrypt.hash(userdto.password, bcrypt.genSaltSync());
  const newUser: UserInsertModel = {
    ...userdto,
    role: Role.USER,
    password: pwd_hash,
  };
  const success = await userRepo.createUser(newUser);
  if (!success) {
    return R.error("系统错误");
  }
  const { username, role } = newUser;
  return R.ok("注册成功", { username, role });
};
