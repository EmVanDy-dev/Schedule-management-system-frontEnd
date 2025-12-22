export type Role = "admin" | "teacher" | "student";

export interface User {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  roleName?: Role;   // optional, if backend does not send
  roleID: number;      // backend sends "admin", "teacher", or "student"
  password:string
}