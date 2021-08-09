export interface SkillLevel {
  level: number;
}

export interface User {
  name: string;
  skills: { [key: string]: SkillLevel };
}

export interface Skill {
  description: string;
}

export interface Data {
  users: { [key: string]: User };
  skills: { [key: string]: Skill };
}
