"use client";
import CreateProblemForm from "@/components/CreateProblemForm";
import { ProblemInsertModel } from "@/schema/problem.schema";

export default function CreateProblemPage() {
  const handleSubmit = (data:Partial<ProblemInsertModel>) => {
    console.log(data);
  };
  return (
    <>
      <CreateProblemForm onSubmit={handleSubmit} /> 
    </>
  );
}
