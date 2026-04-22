import { JudgeResultEnum, Status } from "@/constants/enum";
import {
  CodeSandbox,
  ExecuteCodeRequest,
  ExecuteCodeResponse,
} from "@/core/interface/judge.interface";
import { LANGUAGE_ID_MAP } from "@/core/config/language.config";
import {
  Judge0SubmissionRequest,
  Judge0Submission,
  JUDGE0_STATUS_MAP,
} from "@/core/types/judge0.types";

// 获取 Judge0 API 地址
const getJudge0ApiUrl = (): string => {
  // 优先使用环境变量
  if (process.env.JUDGE0_API_URL) {
    return process.env.JUDGE0_API_URL;
  }
  // 默认使用公共 API
  return "https://ce.judge0.com";
};

export default class ThirdPartySandbox implements CodeSandbox {
  private apiUrl: string;

  constructor() {
    this.apiUrl = getJudge0ApiUrl();
  }

  // 同步方法，内部调用异步逻辑
  async execute(req: ExecuteCodeRequest): Promise<ExecuteCodeResponse> {
    console.log("ThirdParty sandbox executing...", {
      language: req.language,
      sourceCodeLength: req.source_code.length,
      stdinLength: req.stdin?.length || 0,
    });

    // 1. 获取 language_id
    const languageId = LANGUAGE_ID_MAP[req.language];
    if (!languageId) {
      return {
        stdout: null,
        time: null,
        memory: null,
        compileOutput: null,
        stderr: `Unsupported language: ${req.language}`,
        status: Status.FAILED,
        desc: JudgeResultEnum.WRONG_ANSWER,
      };
    }

    try {
      const requestBody: Judge0SubmissionRequest = {
        language_id: languageId,
        source_code: req.source_code,
        stdin: req.stdin,
        expected_output: req.expectedOutput,
      };

      if (typeof req.timeLimit === "number" && Number.isFinite(req.timeLimit)) {
        requestBody.cpu_time_limit = Math.max(req.timeLimit / 1000, 0.001);
      }

      if (typeof req.memoryLimit === "number" && Number.isFinite(req.memoryLimit)) {
        requestBody.memory_limit = req.memoryLimit;
      }

      // 2. 调用 Judge0 API（同步模式，wait=true）
      const response = await fetch(
        `${this.apiUrl}/submissions?wait=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Judge0 API error: ${response.status} ${response.statusText}${
            errorText ? ` - ${errorText}` : ""
          }`,
        );
      }

      const result: Judge0Submission = await response.json();
      // 3. 解析响应，转换为项目格式
      return this.convertResponse(result);
    } catch (error) {
      console.error("ThirdParty sandbox error:", error);
      return {
        stdout: null,
        time: null,
        memory: null,
        compileOutput: null,
        stderr: error instanceof Error ? error.message : "Unknown error",
        status: Status.FAILED,
        desc: JudgeResultEnum.RUNTIME_ERROR,
      };
    }
  }

  /**
   * 将 Judge0 响应转换为项目格式
   */
  private convertResponse(result: Judge0Submission): ExecuteCodeResponse {
    const statusInfo = JUDGE0_STATUS_MAP[result.status.id] || {
      judgeResult: JudgeResultEnum.RUNTIME_ERROR,
      status: Status.FAILED,
      desc: result.status.description,
    };

    // 转换时间（字符串转为毫秒数）
    const timeMs = result.time ? Math.round(parseFloat(result.time) * 1000) : null;

    return {
      stdout: result.stdout,
      time: timeMs,
      memory: result.memory,
      compileOutput: result.compile_output,
      stderr: result.stderr,
      status: statusInfo.status,
      desc: statusInfo.judgeResult,
    };
  }
}
