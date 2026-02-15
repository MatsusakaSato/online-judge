import { JudgeResultEnum, Status } from "@/constants/enum";
import {
  CodeSandbox,
  ExecuteCodeRequest,
  ExecuteCodeResponse,
} from "@/core/interface/judge";
export default class RemoteSandbox implements CodeSandbox {
  execute(req: ExecuteCodeRequest): ExecuteCodeResponse {
    console.log("remote code sandbox executing...");
    return {
      time: null,
      memory: null,
      compileOutput: null,
      stdout: null,
      stderr: null,
      status: Status.SUCCESS,
      desc: JudgeResultEnum.ACCEPTED,
    };
  }
}
