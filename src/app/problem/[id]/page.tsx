import { Metadata } from "next";
import { getProblemById } from "@/repository/problem.repo";
import ProblemDetailClient from "./ProblemDetailClient";

interface ProblemDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProblemDetailPageProps): Promise<Metadata> {
  const problem = await getProblemById(Number(params.id));

  if (!problem) {
    return {
      title: "题目不存在",
    };
  }

  return {
    title: `${problem.id}. ${problem.title} - Online Judge (在线编程题目测评平台)`,
  };
}

export default async function ProblemDetailPage({
  params,
}: ProblemDetailPageProps) {
  const problem = await getProblemById(Number(params.id));

  if (!problem) {
    return (
      <div className="h-screen bg-muted p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">题目不存在</h1>
          <p className="text-gray-600">请检查题目ID是否正确</p>
        </div>
      </div>
    );
  }

  return (
    <ProblemDetailClient
      problemId={problem.id}
      content={problem.content || ""}
      answer={problem.answer || ""}
    />
  );
}
