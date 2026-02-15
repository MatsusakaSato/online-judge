"use client";
import CreateProblemForm from "@/components/CreateProblemForm";
import { getProblemById } from "@/repository/problem.repo";
import { ProblemSelectModel } from "@/schema/problem.schema";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateProblemPage() {
  const [problemInfo, setProblemInfo] = useState<ProblemSelectModel>();
  const params = useParams();

  const id = params.id;
  useEffect(() => {
    const _ = async () => {
      const res = await getProblemById(Number(id));
      setProblemInfo(res);
    };
    _();
  }, []);
  //TODO 这里的用户id是写死的，应该改成动态获取用户id
  return (
    <>
      <CreateProblemForm initialValue={problemInfo} userId={1} />
    </>
  );
}
