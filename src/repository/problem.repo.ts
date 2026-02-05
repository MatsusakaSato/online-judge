import { client } from "@/schema/db.client";
import {
  problemTable,
  ProblemInsertModel,
} from "@/schema/problem.schema";
import { eq, and, sql } from "drizzle-orm";

const createProblem = async (problem: ProblemInsertModel) => {
  const [result] = await client.insert(problemTable).values(problem);
  return result.affectedRows > 0;
};

const getProblemById = async (id: number) => {
  return await client.query.problemTable.findFirst({
    where: and(eq(problemTable.id, id), eq(problemTable.isDeleted, false)),
  });
};

const getProblems = async (limit?: number, offset?: number) => {
  return await client.query.problemTable.findMany({
    where: eq(problemTable.isDeleted, false),
    limit,
    offset,
  });
};

const updateProblem = async (
  id: number,
  problem: Partial<ProblemInsertModel>,
) => {
  const [result] = await client
    .update(problemTable)
    .set(problem)
    .where(and(eq(problemTable.id, id), eq(problemTable.isDeleted, false)));

  return result.affectedRows > 0;
};

const deleteProblem = async (id: number) => {
  const [result] = await client
    .update(problemTable)
    .set({ isDeleted: true })
    .where(and(eq(problemTable.id, id), eq(problemTable.isDeleted, false)));

  return result.affectedRows > 0;
};

const incrementSubmitCount = async (problemId: number) => {
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

const incrementAcceptedCount = async (problemId: number) => {
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

export const problemRepo = {
  createProblem,
  getProblemById,
  getProblems,
  updateProblem,
  deleteProblem,
  incrementSubmitCount,
  incrementAcceptedCount,
};
