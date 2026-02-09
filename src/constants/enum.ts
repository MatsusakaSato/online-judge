enum Role {
  USER = "user",
  ADMIN = "admin",
}

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

enum Status {
  PENDING = "0",
  JUDGING = "1",
  SUCCESS = "2",
  FAILED = "3",
}

enum ApiCode {
  SUCCESS = 0,
  ERROR = 1,
}

export { Role, JudgeResultEnum, Status, ApiCode };
