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

export type StudentGroupMemberData = {
  id: number;
  studentID: number;
  groupID: number;
  studentName: string;
  groupName: string;
};

export type StudentGroupData = {
  id: number;
  groupName: string;
  generation: number;
  generationYear: number;
  majorID: number;
  majorName: string;
};

export type Member = {
  id: number
  studentID: number
  studentName: string
}

export type Student = {
  id: number
  first_name: string
  last_name: string
  email: string
}