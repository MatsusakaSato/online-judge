import {
  int,
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";

export const problemTable = mysqlTable("problem", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  content: text("content").notNull(),
  tags: varchar("tags", { length: 1024 }), //json数组，比如["二叉树","难","并查集","遍历"]
  answer: text("answer"), //（官方）题解
  submitNum: int("submit_num").default(0).notNull(),
  acceptedNum: int("acceptd_num").default(0).notNull(),
  judgeCase: text(), //判题用例，json数组, 例：[{input:'1 2',output:'3'}{input:'0 0',output:'0'}]
  judgeConfig: text(), //判题配置，比如限制时间，内存占用等,例：{timeLimit:1000,stackLimit:1000}
  userId: int().notNull(), //创建题目的用户id
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});
