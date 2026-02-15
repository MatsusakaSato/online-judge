import { Status } from "@/constants/enum";
import { Language } from "@/constants/enum";
export interface ExecuteCodeRequest {
  source_code: string; //源代码
  language: Language; //语言
  stdin: string[]; //输入用例
}
export interface ExecuteCodeResponse {
  stdout: string[] | null; //程序输出
  time: number | null; //程序执行时间
  memory: number | null; //程序占用内存
  compileOutput: string | null; //编译输出（非编译型语言没有）
  stderr: string | null; //错误输出（未发生错误为null）
  status: Status; //程序状态
  desc: string; //描述
}
export interface CodeSandbox {
  execute: (req: ExecuteCodeRequest) => ExecuteCodeResponse;
}
