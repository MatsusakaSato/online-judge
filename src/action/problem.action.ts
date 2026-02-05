"use server";

import { problemRepo } from "@/repository/problem.repo";
import { ProblemInsertModel } from "@/schema/problem.schema";

export const createProblemAction = async (
  problem: ProblemInsertModel,
  userId: number,
) => {
  return await problemRepo.createProblem({
    ...problem,
    userId,
  });
};

export const getProblemByIdAction = async (id: number) => {
  const problem = await problemRepo.getProblemById(id);
  if (!problem) return undefined;
  return problem;
};

export const getProblemsAction = async (limit?: number, offset?: number) => {
  const problems = await problemRepo.getProblems(limit, offset);
  return problems;
};

export const updateProblemAction = async (
  id: number,
  problem: ProblemInsertModel,
) => {
  return await problemRepo.updateProblem(id, problem);
};

export const deleteProblemAction = async (id: number) => {
  return await problemRepo.deleteProblem(id);
};

export const incrementSubmitCountAction = async (problemId: number) => {
  return await problemRepo.incrementSubmitCount(problemId);
};

export const incrementAcceptedCountAction = async (problemId: number) => {
  return await problemRepo.incrementAcceptedCount(problemId);
};
