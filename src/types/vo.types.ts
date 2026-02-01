import { z } from "zod";
import { Role } from "@/enum/enum";
export const $UserVO = z.object({
  username: z.string(),
  role: z.enum([Role.USER, Role.ADMIN]),
  token: z.string().optional(),
});
export type UserVO = z.infer<typeof $UserVO>;
export const $ProblemVO = z.object({
  id: z.int(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
  submitNum: z.number(),
  acceptedNum: z.number(),
  userId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ProblemVO = z.infer<typeof $ProblemVO>;
