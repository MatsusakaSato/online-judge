export default class Result<T = void> {
  code: number;
  msg: string;
  data?: T;
  private constructor(code: number, msg: string, data?: T) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
  static ok<U = void>(msg: string, data?: U): Result<U> {
    return data === undefined
      ? new Result(200, msg)
      : new Result(200, msg, data);
  }
  static error<U = void>(msg: string, data?: U): Result<U> {
    return data === undefined
      ? new Result(400, msg)
      : new Result(400, msg, data);
  }
}
