import { User } from "./user";

export interface Skill {
  description: string;
}

export interface Data {
  users: { [key: string]: User };
  skills: { [key: string]: Skill };
}
