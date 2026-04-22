import { and, desc, eq } from "drizzle-orm";
import { client } from "@/schema/db.client";
import {
  SubmitInsertModel,
  SubmitSelectModel,
  submitTable,
} from "@/schema/problem.schema";

export const createSubmission = async (
  submission: SubmitInsertModel,
): Promise<number | null> => {
  const [result] = await client.insert(submitTable).values(submission);
  if (result.affectedRows <= 0) {
    return null;
  }

  return Number(result.insertId);
};

export const updateSubmission = async (
  id: number,
  submission: Partial<SubmitInsertModel>,
) => {
  const [result] = await client
    .update(submitTable)
    .set(submission)
    .where(and(eq(submitTable.id, id), eq(submitTable.isDeleted, false)));

  return result.affectedRows > 0;
};

export const getProblemSubmissionsByUser = async (
  problemId: number,
  userId: number,
  limit = 20,
): Promise<SubmitSelectModel[]> => {
  return await client.query.submitTable.findMany({
    where: and(
      eq(submitTable.problemId, problemId),
      eq(submitTable.userId, userId),
      eq(submitTable.isDeleted, false),
    ),
    orderBy: [desc(submitTable.createdAt)],
    limit,
  });
};
