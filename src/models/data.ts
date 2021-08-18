import { User } from "./user";
import { Skill } from "./skill";

export interface Data {
  users?: { [key: string]: User };
  skills?: { [key: string]: Skill };
}
