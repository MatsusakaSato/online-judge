import { client } from "@/schema/db.client";
import {
  userTable,
  UserInsertModel,
  UserSelectModel,
} from "@/schema/user.schema";
import { eq, and } from "drizzle-orm";

export const createUser = async (user: UserInsertModel): Promise<boolean> => {
  const [result] = await client.insert(userTable).values(user);
  return result.affectedRows > 0;
};

export const getUserById = async (
  id: number,
): Promise<UserSelectModel | undefined> => {
  return await client.query.userTable.findFirst({
    where: and(eq(userTable.id, id), eq(userTable.isDeleted, false)),
  });
};

export const getUserByEmail = async (
  email: string,
): Promise<UserSelectModel | undefined> => {
  return await client.query.userTable.findFirst({
    where: and(eq(userTable.email, email), eq(userTable.isDeleted, false)),
  });
};

export const getUsers = async (
  limit?: number,
  offset?: number,
): Promise<UserSelectModel[]> => {
  return await client.query.userTable.findMany({
    where: eq(userTable.isDeleted, false),
    limit,
    offset,
  });
};

export const updateUser = async (
  id: number,
  user: Partial<UserInsertModel>,
): Promise<boolean> => {
  const [result] = await client
    .update(userTable)
    .set(user)
    .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)));

  return result.affectedRows > 0;
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const [result] = await client
    .update(userTable)
    .set({ isDeleted: true })
    .where(and(eq(userTable.id, id), eq(userTable.isDeleted, false)));

  return result.affectedRows > 0;
};
