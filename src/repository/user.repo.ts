import { client } from "@/schema/db.client";
import {
  userTable,
  UserInsertModel,
  UserSelectModel,
} from "@/schema/user.schema";
import { eq, and } from "drizzle-orm";

const createUser = async (user: UserInsertModel) => {
  const [result] = await client.insert(userTable).values(user);
  return result.affectedRows > 0;
};

const getUserById = async (id: number) => {
  return await client.query.userTable.findFirst({
    where: and(eq(userTable.id, id), eq(userTable.isDeleted, false)),
  });
};

const getUserByEmail = async (email: string) => {
  return await client.query.userTable.findFirst({
    where: and(eq(userTable.email, email), eq(userTable.isDeleted, false)),
  });
};

const getUsers = async (limit?: number, offset?: number) => {
  return await client.query.userTable.findMany({
    where: eq(userTable.isDeleted, false),
    limit,
    offset,
  });
};

const updateUser = async (id: number, user: Partial<UserInsertModel>) => {
  const [result] = await client
    .update(userTable)
    .set(user)
    .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)));
  return result.affectedRows > 0;
};

const deleteUser = async (id: number) => {
  const [result] = await client
    .update(userTable)
    .set({ isDeleted: true })
    .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)));

  return result.affectedRows > 0;
};

export const userRepo = {
  createUser,
  getUserById,
  getUserByEmail,
  getUsers,
  updateUser,
  deleteUser,
};
