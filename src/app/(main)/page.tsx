import ProblemListClient from "@/components/problem-table/ProblemListClient";
import { getProblems, getProblemsCount } from "@/repository/problem.repo";

const PAGE_SIZE = 20;

export default async function ProblemListPage() {
  const initialData = await getProblems(PAGE_SIZE, 0);
  const total = await getProblemsCount();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border bg-card px-6 py-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">题目列表</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          浏览题目、查看详情并提交你的解法。
        </p>
      </div>
      <ProblemListClient initialData={initialData} total={total} />
    </div>
  );
}
