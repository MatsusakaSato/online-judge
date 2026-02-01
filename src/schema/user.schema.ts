import { Role } from "@/enum/enum";
import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";

export const userTable = mysqlTable("user", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  role: varchar("role", { length: 20 }).notNull().$type<Role>(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});
export type UserSelectModel = typeof userTable.$inferSelect;
export type UserInsertModel = typeof userTable.$inferInsert;
