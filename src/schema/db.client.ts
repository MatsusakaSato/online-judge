import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { userTable } from "./user.schema";
import { problemTable, submitTable } from "./problem.schema";
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "online_judge",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const client = drizzle(pool, {
  schema: { userTable, problemTable, submitTable },
  mode: "default",
  logger: true,
});
