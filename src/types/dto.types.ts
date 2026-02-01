import z from "zod";
export const $UserDTO = z.object({
  email: z.email(),
  username: z.string().optional().default("匿名用户"),
  password: z.string(),
});
export type UserDTO = z.infer<typeof $UserDTO>;

export const $ProblemDTO = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
  answer: z.string().optional(),
  judgeCase: z
    .array(z.object({ input: z.string(), output: z.string() }))
    .optional(),
  judgeConfig: z
    .object({ timeLimit: z.number(), memoryLimit: z.number() })
    .optional(),
});
export type ProblemDTO = z.infer<typeof $ProblemDTO>;
