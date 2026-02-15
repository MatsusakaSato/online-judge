import {
  CodeSandbox,
  ExecuteCodeRequest,
  ExecuteCodeResponse,
} from "./interface/judge.interface";
import consola from "consola";

export default class SandboxProxy implements CodeSandbox {
  private sandbox: CodeSandbox;
  constructor(sandbox: CodeSandbox) {
    this.sandbox = sandbox;
  }
  execute(req: ExecuteCodeRequest): ExecuteCodeResponse {
    consola.info("代码沙箱请求信息：", req);
    const result = this.sandbox.execute(req);
    consola.info("代码沙箱响应信息：", result);
    return result;
  }
}
