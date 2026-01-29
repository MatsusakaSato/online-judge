import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "online_judge",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const client = drizzle(pool);
