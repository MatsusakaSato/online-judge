import { NextResponse } from "next/server";
import { JudgeResultEnum, Language, Status } from "@/constants/enum";
import { R } from "@/common/ApiResponse";
import { getCurrentUser } from "@/lib/auth.util";
import { judgeSubmission } from "@/core/judge.service";
import {
  getProblemById,
  incrementAcceptedCount,
  incrementSubmitCount,
} from "@/repository/problem.repo";
import {
  createSubmission,
  getProblemSubmissionsByUser,
  updateSubmission,
} from "@/repository/submit.repo";
import { SubmissionRecord } from "@/types/judge";

interface RouteContext {
  params: {
    id: string;
  };
}

const toSubmissionRecord = (submission: Awaited<ReturnType<typeof getProblemSubmissionsByUser>>[number]): SubmissionRecord => {
  return {
    id: submission.id,
    code: submission.code,
    language: submission.language as Language,
    state: submission.state as Status,
    judgeInfo: submission.judgeInfo,
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
  };
};

const isValidLanguage = (language: string): language is Language => {
  return Object.values(Language).includes(language as Language);
};

export async function GET(_: Request, { params }: RouteContext) {
  const problemId = Number(params.id);
  const user = await getCurrentUser();

  if (!Number.isInteger(problemId) || problemId <= 0) {
    return NextResponse.json(R.error("题目 ID 无效"), { status: 400 });
  }

  if (!user?.id) {
    return NextResponse.json(R.ok("请先登录后查看提交记录", []));
  }

  try {
    const submissions = await getProblemSubmissionsByUser(problemId, Number(user.id));
    return NextResponse.json(
      R.ok(
        "获取提交记录成功",
        submissions.map((submission) => toSubmissionRecord(submission)),
      ),
    );
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(R.error("获取提交记录失败"), { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const problemId = Number(params.id);
  const user = await getCurrentUser();

  if (!Number.isInteger(problemId) || problemId <= 0) {
    return NextResponse.json(R.error("题目 ID 无效"), { status: 400 });
  }

  if (!user?.id) {
    return NextResponse.json(R.error("请先登录后再提交"), { status: 401 });
  }

  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const language = typeof body.language === "string" ? body.language : "";

    if (!code) {
      return NextResponse.json(R.error("提交代码不能为空"), { status: 400 });
    }

    if (!isValidLanguage(language)) {
      return NextResponse.json(R.error("提交语言不受支持"), { status: 400 });
    }

    const problem = await getProblemById(problemId);
    if (!problem) {
      return NextResponse.json(R.error("题目不存在"), { status: 404 });
    }

    const submissionId = await createSubmission({
      userId: Number(user.id),
      problemId,
      code,
      language,
      state: Status.PENDING,
      judgeInfo: {
        status: JudgeResultEnum.WAITING,
        memory: 0,
        time: 0,
        message: "等待判题",
        passedCases: 0,
        totalCases: problem.judgeCase?.length ?? 0,
      },
    });

    if (!submissionId) {
      return NextResponse.json(R.error("创建提交记录失败"), { status: 500 });
    }

    await incrementSubmitCount(problemId);
    await updateSubmission(submissionId, {
      state: Status.JUDGING,
      judgeInfo: {
        status: JudgeResultEnum.WAITING,
        memory: 0,
        time: 0,
        message: "判题中",
        passedCases: 0,
        totalCases: problem.judgeCase?.length ?? 0,
      },
    });

    const judgeResult = await judgeSubmission({
      sourceCode: code,
      language,
      judgeCase: problem.judgeCase ?? [],
      judgeConfig: problem.judgeConfig,
    });

    await updateSubmission(submissionId, {
      state: judgeResult.state,
      judgeInfo: judgeResult.judgeInfo,
    });

    if (judgeResult.state === Status.SUCCESS) {
      await incrementAcceptedCount(problemId);
    }

    const responsePayload: SubmissionRecord = {
      id: submissionId,
      code,
      language,
      state: judgeResult.state,
      judgeInfo: judgeResult.judgeInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!judgeResult.sandboxAvailable) {
      return NextResponse.json(
        R.error("第三方判题沙箱当前不可用，请稍后重试", responsePayload),
        { status: 503 },
      );
    }

    return NextResponse.json(R.ok("提交成功", responsePayload));
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(R.error("提交失败，请稍后重试"), { status: 500 });
  }
}
