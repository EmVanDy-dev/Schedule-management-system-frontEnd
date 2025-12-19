export type Role = "admin" | "teacher" | "student";

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
}