import { JudgeResultEnum, Status } from "@/constants/enum";
import {
  CodeSandbox,
  ExecuteCodeRequest,
  ExecuteCodeResponse,
} from "@/core/interface/judge.interface";

export default class ExampleSandbox implements CodeSandbox {
  execute(req: ExecuteCodeRequest): ExecuteCodeResponse {
    console.log("example code sandbox executing...");
    return {
      time: 100,
      memory: 1024,
      compileOutput: "",
      stdout: ["3", "7"],
      stderr: null,
      status: Status.SUCCESS,
      desc: JudgeResultEnum.ACCEPTED,
    };
  }
}
