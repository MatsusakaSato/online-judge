"use server";

import { UserInsertModel } from "@/schema/user.schema";
import * as bcrypt from "bcrypt";
import * as userRepo from "@/repository/user.repo";
import { Role } from "@/constants/enum";
import { R } from "@/common/ApiResponse";
import { getServerSession } from "next-auth";

export const registerAction = async (userdto: UserInsertModel) => {
  const existingUsers = await userRepo.getUserByEmail(userdto.email);
  if (existingUsers) {
    return R.error("用户已存在");
  }
  const pwd_hash = await bcrypt.hash(userdto.password!, bcrypt.genSaltSync());
  const newUser: UserInsertModel = {
    ...userdto,
    role: Role.USER,
    password: pwd_hash,
  };
  const success = await userRepo.createUser(newUser);
  if (!success) {
    return R.error("系统错误");
  }

  return R.ok("注册成功");
};

export const updateUserInfoAction = async (
  userInfo: Partial<UserInsertModel>,
) => {
  const session = await getServerSession();
  if (!session) {
    return R.error("未登录");
  }
  const userId = session.user?.id;
  if (!userId) {
    return R.error("未登录");
  }
  const success = await userRepo.updateUser(userInfo.id!, userInfo);
  if (!success) {
    return R.error("系统错误");
  }
  return R.ok("更新成功");
};
