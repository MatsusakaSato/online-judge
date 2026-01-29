import type { Config } from "drizzle-kit";

export default {
  dialect: "mysql",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "online_judge",
  },
  schema: "./src/schema/*.schema.ts",
  out: "./drizzle",
} satisfies Config;
