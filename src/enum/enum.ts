// 角色枚举
enum Role {
  USER = "user",
  ADMIN = "admin",
}

// 判题结果枚举
enum JudgeResultEnum {
  ACCEPTED = "Accepted",
  COMPILE_ERROR = "Compile Error",
  MEMORY_LIMIT_EXCEED = "Memory Limit Exceed",
  TIME_LIMIT_EXCEED = "Time Limit Exceed",
  WRONG_ANSWER = "Wrong Answer",
  RUNTIME_ERROR = "Runtime Error",
  WAITING = "Waiting",
  DANGEROUS_OPERATION = "Dangerous Operation",
}

// 提交状态枚举
enum Status {
  PENDING = "0", //刚提交
  JUDGING = "1", //判题机判题中
  SUCCESS = "2", //通过
  FAILED = "3", //未通过
}
export { Role, JudgeResultEnum, Status };
