import { client } from "@/schema/db.client";
import {
  problemTable,
  ProblemInsertModel,
  ProblemSelectModel,
} from "@/schema/problem.schema";
import { eq, and, sql } from "drizzle-orm";

export const createProblem = async (
  problem: ProblemInsertModel,
): Promise<boolean> => {
  const [result] = await client.insert(problemTable).values(problem);
  return result.affectedRows > 0;
};

export const getProblemById = async (
  id: number,
): Promise<ProblemSelectModel | undefined> => {
  return await client.query.problemTable.findFirst({
    where: and(eq(problemTable.id, id), eq(problemTable.isDeleted, false)),
  });
};

export const getProblems = async (
  limit?: number,
  offset?: number,
): Promise<ProblemSelectModel[]> => {
  return await client.query.problemTable.findMany({
    where: eq(problemTable.isDeleted, false),
    limit,
    offset,
  });
};

export const updateProblem = async (
  id: number,
  problem: Partial<ProblemInsertModel>,
): Promise<boolean> => {
  const [result] = await client
    .update(problemTable)
    .set(problem)
    .where(and(eq(problemTable.id, id), eq(problemTable.isDeleted, false)));

  return result.affectedRows > 0;
};

export const deleteProblem = async (id: number): Promise<boolean> => {
  const [result] = await client
    .update(problemTable)
    .set({ isDeleted: true })
    .where(and(eq(problemTable.id, id), eq(problemTable.isDeleted, false)));

  return result.affectedRows > 0;
};

export const incrementSubmitCount = async (
  problemId: number,
): Promise<boolean> => {
  const [result] = await client
    .update(problemTable)
    .set({
      submitNum: sql`${problemTable.submitNum} + 1`,
    })
    .where(
      and(eq(problemTable.id, problemId), eq(problemTable.isDeleted, false)),
    );

  return result.affectedRows > 0;
};

export const incrementAcceptedCount = async (
  problemId: number,
): Promise<boolean> => {
  const [result] = await client
    .update(problemTable)
    .set({
      acceptedNum: sql`${problemTable.acceptedNum} + 1`,
    })
    .where(
      and(eq(problemTable.id, problemId), eq(problemTable.isDeleted, false)),
    );

  return result.affectedRows > 0;
};
