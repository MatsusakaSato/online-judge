export type Role = "user" | "admin";
import { z } from "zod";
export const $UserVO = z.object({
  username: z.string(),
  role: z.enum(["user", "admin"]),
  token: z.string().optional(),
});
export type UserVO = z.infer<typeof $UserVO>;
