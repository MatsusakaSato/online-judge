export type Role = "user" | "admin";
export interface UserVO {
  username: string;
  role: Role;
}
