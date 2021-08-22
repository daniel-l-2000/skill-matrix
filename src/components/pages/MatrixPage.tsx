import KnowledgeLevel from "../matrix/KnowledgeLevel";
import User from "../matrix/User";
import classes from "./MatrixPage.module.css";
import Skill from "../matrix/Skill";
import { useEffect, useReducer } from "react";
import useDatabase from "../../hooks/use-database";
import { User as UserModel } from "../../models/user";
import { Skill as SkillModel } from "../../models/skill";

type Users = { [key: string]: UserModel };
type Skills = { [key: string]: SkillModel };

interface MatrixState {
  users?: Users;
  skills?: Skills;
}

interface MatrixDispatchAction {
  type: "INITIALIZE_USERS" | "INITIALIZE_SKILLS" | "SET_SKILL_LEVEL";
  users?: Users;
  skills?: Skills;
  userId?: string;
  skill?: string;
  level?: number;
}

function matrixReducer(
  state: MatrixState,
  action: MatrixDispatchAction
): MatrixState {
  switch (action.type) {
    case "INITIALIZE_USERS":
      if (action.users) {
        return { ...state, users: action.users };
      }
      throw new Error("users property must be set!");

    case "INITIALIZE_SKILLS":
      if (action.skills) {
        return { ...state, skills: action.skills };
      }
      throw new Error("users property must be set!");

    case "SET_SKILL_LEVEL":
      if (action.userId && action.skill && action.level !== undefined) {
        const user = state.users && state.users[action.userId];
        if (user) {
          if (!user.skills) {
            user.skills = {};
          }
          user.skills[action.skill] = { level: action.level };
        }
        return { ...state };
      }
      throw new Error("user, skill and level properties must be set!");
  }
}

function MatrixPage() {
  const [matrixState, dispatchMatrix] = useReducer(matrixReducer, {});

  const readUsers = useDatabase<Users>("/users", "read");
  const readSkills = useDatabase<Skills>("/skills", "read");

  useEffect(() => {
    readUsers().then((users) => {
      if (users) {
        dispatchMatrix({ type: "INITIALIZE_USERS", users });
      }
    });
    readSkills().then((skills) => {
      if (skills) {
        dispatchMatrix({ type: "INITIALIZE_SKILLS", skills });
      }
    });
  }, [readUsers, readSkills]);

  if (!matrixState.users || !matrixState.skills) {
    return <div></div>;
  }

  const skills: string[] = [];
  for (const skill in matrixState.skills) {
    skills.push(skill);
  }

  const userIds: string[] = [];
  for (const userId in matrixState.users) {
    userIds.push(userId);
  }

  const updateSkillHandler = (userId: string, skill: string, level: number) => {
    dispatchMatrix({ type: "SET_SKILL_LEVEL", userId, skill, level });
  };

  return (
    <div className={classes.matrixGrid}>
      {skills.map((s, i) => (
        <Skill name={s} index={i} key={s}></Skill>
      ))}
      {userIds.map((id, i) => {
        const user = matrixState.users && matrixState.users[id];
        if (user?.name) {
          return <User index={i} id={id} name={user.name} key={id}></User>;
        }
        return null;
      })}

      {skills.map((s, si) => {
        return userIds.map((uid, ui) => {
          const user = matrixState.users && matrixState.users[uid];
          if (user?.name) {
            const level = user.skills && user.skills[s]?.level;
            return (
              <KnowledgeLevel
                key={`${s}_${uid}`}
                level={level ?? 0}
                skillIndex={si}
                userIndex={ui}
                skill={s}
                userId={uid}
                onUpdateSkill={updateSkillHandler}
              ></KnowledgeLevel>
            );
          }
          return null;
        });
      })}
    </div>
  );
}

export default MatrixPage;
