export interface SkillLevel {
  level: number;
}

export interface User {
  name: string;
  skills: { [key: string]: SkillLevel };
}
