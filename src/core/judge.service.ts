import { JudgeResultEnum, Language, Status } from "@/constants/enum";
import sandbox from "@/core";
import { JudgeCase, JudgeConfig, JudgeInfo } from "@/types/judge";

interface JudgeSubmissionRequest {
  sourceCode: string;
  language: Language;
  judgeCase: JudgeCase;
  judgeConfig?: JudgeConfig | null;
}

interface JudgeSubmissionResult {
  state: Status;
  judgeInfo: JudgeInfo;
  sandboxAvailable: boolean;
}

const toJudge0MemoryLimit = (memoryLimitMb?: number | null) => {
  if (typeof memoryLimitMb !== "number" || !Number.isFinite(memoryLimitMb)) {
    return undefined;
  }

  // Judge0 expects KB, while the problem form stores memory limit in MB.
  return Math.max(Math.round(memoryLimitMb * 1024), 2048);
};

const SANDBOX_UNAVAILABLE_PATTERN =
  /(fetch failed|network|timed out|econn|enotfound|judge0 api error: 429|judge0 api error: 5\d\d)/i;

const normalizeOutput = (value?: string | null) => {
  return (value ?? "").replace(/\r\n/g, "\n").trimEnd();
};

const toOptionalText = (value?: string | null) => {
  const normalized = normalizeOutput(value);
  return normalized ? normalized : undefined;
};

const isSandboxUnavailableError = (message?: string | null) => {
  if (!message) {
    return false;
  }

  return SANDBOX_UNAVAILABLE_PATTERN.test(message);
};

export const judgeSubmission = async ({
  sourceCode,
  language,
  judgeCase,
  judgeConfig,
}: JudgeSubmissionRequest): Promise<JudgeSubmissionResult> => {
  if (!judgeCase.length) {
    return {
      state: Status.FAILED,
      sandboxAvailable: true,
      judgeInfo: {
        status: JudgeResultEnum.RUNTIME_ERROR,
        memory: 0,
        time: 0,
        message: "题目未配置判题用例",
        passedCases: 0,
        totalCases: 0,
      },
    };
  }

  let maxTime = 0;
  let maxMemory = 0;
  let passedCases = 0;

  for (let index = 0; index < judgeCase.length; index += 1) {
    const currentCase = judgeCase[index];
    const result = await sandbox.execute({
      source_code: sourceCode,
      language,
      stdin: currentCase.input,
      expectedOutput: currentCase.output,
      timeLimit: judgeConfig?.timeLimit,
      memoryLimit: toJudge0MemoryLimit(judgeConfig?.memoryLimit),
    });

    maxTime = Math.max(maxTime, result.time ?? 0);
    maxMemory = Math.max(maxMemory, result.memory ?? 0);

    if (
      result.status === Status.FAILED &&
      result.desc === JudgeResultEnum.RUNTIME_ERROR &&
      !result.stdout &&
      !result.compileOutput &&
      isSandboxUnavailableError(result.stderr)
    ) {
      return {
        state: Status.FAILED,
        sandboxAvailable: false,
        judgeInfo: {
          status: JudgeResultEnum.RUNTIME_ERROR,
          memory: maxMemory,
          time: maxTime,
          message: `第三方判题沙箱当前不可用：${result.stderr}`,
          passedCases,
          totalCases: judgeCase.length,
        },
      };
    }

    if (result.status !== Status.SUCCESS || result.desc !== JudgeResultEnum.ACCEPTED) {
      const expectedOutput = normalizeOutput(currentCase.output);
      const actualOutput = normalizeOutput(result.stdout);
      const errorOutput = toOptionalText(result.compileOutput || result.stderr);
      const fallbackMessage =
        result.desc === JudgeResultEnum.WRONG_ANSWER
          ? "输出结果与预期不一致"
          : errorOutput || "判题失败";

      return {
        state: result.status,
        sandboxAvailable: true,
        judgeInfo: {
          status: result.desc as JudgeResultEnum,
          memory: maxMemory,
          time: maxTime,
          message: fallbackMessage,
          passedCases,
          totalCases: judgeCase.length,
          failedCase: {
            caseIndex: index + 1,
            input: normalizeOutput(currentCase.input),
            expectedOutput,
            actualOutput: toOptionalText(actualOutput),
            errorOutput,
          },
        },
      };
    }

    passedCases += 1;
  }

  return {
    state: Status.SUCCESS,
    sandboxAvailable: true,
    judgeInfo: {
      status: JudgeResultEnum.ACCEPTED,
      memory: maxMemory,
      time: maxTime,
      passedCases,
      totalCases: judgeCase.length,
    },
  };
};
