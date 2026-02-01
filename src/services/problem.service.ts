import { ProblemDTO } from "@/types/dto.types";
import { ProblemVO } from "@/types/vo.types";
import { problemRepo } from "@/repository/problem.repo";

const createProblem = async (
  problem: ProblemDTO,
  userId: number,
): Promise<boolean> => {
  return await problemRepo.createProblem({
    ...problem,
    userId,
    submitNum: 0,
    acceptedNum: 0,
    isDeleted: false,
  });
};

const getProblemById = async (
  id: number,
): Promise<ProblemVO | undefined> => {
  const problem = await problemRepo.getProblemById(id);
  if (!problem) return undefined;
  
  return {
    id: problem.id,
    title: problem.title,
    content: problem.content,
    tags: problem.tags,
    submitNum: problem.submitNum,
    acceptedNum: problem.acceptedNum,
    userId: problem.userId,
    createdAt: problem.createdAt.toISOString(),
    updatedAt: problem.updatedAt.toISOString(),
  };
};

const getProblems = async (
  limit?: number,
  offset?: number,
): Promise<ProblemVO[]> => {
  const problems = await problemRepo.getProblems(limit, offset);
  
  return problems.map((problem) => ({
    id: problem.id,
    title: problem.title,
    content: problem.content,
    tags: problem.tags,
    submitNum: problem.submitNum,
    acceptedNum: problem.acceptedNum,
    userId: problem.userId,
    createdAt: problem.createdAt.toISOString(),
    updatedAt: problem.updatedAt.toISOString(),
  }));
};

const updateProblem = async (
  id: number,
  problem: ProblemDTO,
): Promise<boolean> => {
  return await problemRepo.updateProblem(id, problem);
};

const deleteProblem = async (id: number): Promise<boolean> => {
  return await problemRepo.deleteProblem(id);
};

const incrementSubmitCount = async (
  problemId: number,
): Promise<boolean> => {
  return await problemRepo.incrementSubmitCount(problemId);
};

const incrementAcceptedCount = async (
  problemId: number,
): Promise<boolean> => {
  return await problemRepo.incrementAcceptedCount(problemId);
};

export const problemService = {
  createProblem,
  getProblemById,
  getProblems,
  updateProblem,
  deleteProblem,
  incrementSubmitCount,
  incrementAcceptedCount,
};

