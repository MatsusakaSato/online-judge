import { JudgeResultEnum, Language, Status } from "@/constants/enum";

export interface JudgeCaseItem {
  input: string;
  output: string;
}

export type JudgeCase = JudgeCaseItem[];

export interface JudgeConfig {
  timeLimit: number;
  memoryLimit: number;
}

export interface FailedCaseInfo {
  caseIndex: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  errorOutput?: string;
}

export interface JudgeInfo {
  status: JudgeResultEnum;
  memory: number;
  time: number;
  message?: string;
  passedCases?: number;
  totalCases?: number;
  failedCase?: FailedCaseInfo;
}

export interface SubmissionRecord {
  id: number;
  code: string;
  language: Language;
  state: Status;
  judgeInfo: JudgeInfo;
  createdAt: string;
  updatedAt: string;
}
