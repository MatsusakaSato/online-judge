import { JudgeResultEnum, Status } from "@/constants/enum";

// Judge0 API 请求类型
export interface Judge0SubmissionRequest {
  language_id: number;
  source_code: string;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number; // 秒
  memory_limit?: number;   // KB
}

// Judge0 API 响应类型
export interface Judge0Submission {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  exit_code: number;
  time: string; // 如 "0.015"
  memory: number; // KB
  status: {
    id: number;
    description: string;
  };
}

// Judge0 状态码映射到项目状态
export const JUDGE0_STATUS_MAP: Record<
  number,
  { judgeResult: JudgeResultEnum; status: Status; desc: string }
> = {
  1: { judgeResult: JudgeResultEnum.WAITING, status: Status.PENDING, desc: "Waiting in queue" },
  2: { judgeResult: JudgeResultEnum.WAITING, status: Status.JUDGING, desc: "Processing" },
  3: { judgeResult: JudgeResultEnum.ACCEPTED, status: Status.SUCCESS, desc: "Accepted" },
  4: { judgeResult: JudgeResultEnum.WRONG_ANSWER, status: Status.FAILED, desc: "Wrong Answer" },
  5: {
    judgeResult: JudgeResultEnum.TIME_LIMIT_EXCEED,
    status: Status.FAILED,
    desc: "Time Limit Exceeded",
  },
  6: { judgeResult: JudgeResultEnum.COMPILE_ERROR, status: Status.FAILED, desc: "Compilation Error" },
  7: { judgeResult: JudgeResultEnum.RUNTIME_ERROR, status: Status.FAILED, desc: "Runtime Error" },
  8: {
    judgeResult: JudgeResultEnum.RUNTIME_ERROR,
    status: Status.FAILED,
    desc: "Runtime Error (SIGKILL)",
  },
  9: { judgeResult: JudgeResultEnum.RUNTIME_ERROR, status: Status.FAILED, desc: "Internal Error" },
  10: {
    judgeResult: JudgeResultEnum.RUNTIME_ERROR,
    status: Status.FAILED,
    desc: "Executable Format Error",
  },
};

// 检查状态码是否表示成功
export const isJudge0Success = (statusId: number): boolean => {
  return statusId === 3;
};
