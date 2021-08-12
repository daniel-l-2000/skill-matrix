export interface SkillLevel {
  level: number;
}

export interface User {
  name: string;
  profilePictureToken: string;
  skills: { [key: string]: SkillLevel };
}
