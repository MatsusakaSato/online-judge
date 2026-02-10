import {
  int,
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  index,
  json,
} from "drizzle-orm/mysql-core";
import { JudgeResultEnum, Status } from "@/constants/enum";
type JudgeCase = { input: string; output: string }[];
type JudgeConfig = { timeLimit: number; memoryLimit: number };
type Tags = string[];
type JudgeInfo = {
  status: JudgeResultEnum;
  memory: number;
  time: number;
}; //占用内存（KB），消耗时间（ms）
export const problemTable = mysqlTable(
  "problem",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 512 }).notNull().unique(),
    content: text("content").notNull(),
    tags: json("tags").$type<Tags>(), //json数组，比如["二叉树","难","并查集","遍历"]
    answer: text("answer"), //（官方）题解
    submitNum: int("submit_num").default(0).notNull(),
    acceptedNum: int("accepted_num").default(0).notNull(),
    judgeCase: json("judge_case").$type<JudgeCase>(), //判题用例，json数组, 例：[{input:'1 2',output:'3'}{input:'0 0',output:'0'}]
    judgeConfig: json("judge_config").$type<JudgeConfig>(), //判题配置，比如限制时间，内存占用等,例：{timeLimit:1000,memoryLimit:1000}
    userId: int("user_id").notNull(), //创建题目的用户id
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    isDeleted: boolean("is_deleted").notNull().default(false),
  },
  (table) => [index("user_id_idx").on(table.userId)],
);
export const submitTable = mysqlTable(
  "submit",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull(),
    problemId: int("problem_id").notNull(),
    code: text("code").notNull(),
    language: varchar("language", { length: 255 }).notNull(),
    state: varchar("status", { length: 16 }).notNull().default(Status.PENDING), //状态：待判题，判题中，成功，失败
    judgeInfo: json("judge_info").notNull().$type<JudgeInfo>().default({
      status: JudgeResultEnum.WAITING,
      memory: 0,
      time: 0,
    }), //判题过程中得到的一些信息，比如错误原因，消耗时间，占用内存等
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    isDeleted: boolean("is_deleted").notNull().default(false),
  },
  (table) => [
    index("user_id_idx").on(table.userId),
    index("problem_id_idx").on(table.problemId),
  ],
);
export type ProblemSelectModel = typeof problemTable.$inferSelect;
export type ProblemInsertModel = typeof problemTable.$inferInsert;
export type SubmitSelectModel = typeof submitTable.$inferSelect;
export type SubmitInsertModel = typeof submitTable.$inferInsert;
