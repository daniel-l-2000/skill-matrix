import KnowledgeLevel from "../matrix/KnowledgeLevel";
import User from "../matrix/User";
import classes from "./Matrix.module.css";
import Skill from "../matrix/Skill";
import { useContext, useEffect, useState } from "react";
import { firebaseGet } from "../../api/firebase";
import { Data } from "../../api/models/data";
import LoadingContext from "../../store/loading-context";
import { useHistory } from "react-router-dom";
import ToastContext from "../../store/toast-context";

interface UserWithId {
  id: string;
  name: string;
}

export interface LevelGridData {
  level: number;
  skillIndex: number;
  userIndex: number;
}

function MatrixPage() {
  const [loadedData, setLoadedData] = useState<Data>();

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);

  const history = useHistory();

  useEffect(() => {
    loadingContext.startLoading();
    firebaseGet<Data>("/.json", { toastContext, history }).then((data) => {
      loadingContext.stopLoading();
      setLoadedData(data);
    });
  }, []);

  if (!loadedData) {
    return <div></div>;
  }

  const skills: string[] = [];
  for (const skill in loadedData?.skills) {
    skills.push(skill);
  }

  const users: UserWithId[] = [];
  for (const user in loadedData?.users) {
    users.push({ id: user, name: loadedData.users[user].name });
  }

  const knowledgeLevels: LevelGridData[] = [];
  for (const user of users) {
    const userModel = loadedData.users[user.id];
    if (userModel) {
      for (const skill in userModel.skills) {
        const level = userModel.skills[skill].level;
        knowledgeLevels.push({
          level,
          skillIndex: skills.indexOf(skill),
          userIndex: users.indexOf(user)
        });
      }
    }
  }

  const updateSkillHandler = (level: LevelGridData) => {
    const skill = skills[level.skillIndex];
    const user = loadedData.users[users[level.userIndex].id];
    if (user.skills) {
      user.skills[skill] = { level: level.level };
    } else {
      user.skills = { [skill]: { level: level.level } };
    }
    setLoadedData({ ...loadedData });
  };

  return (
    <div className={classes.matrixGrid}>
      {skills.map((s, i) => (
        <Skill name={s} index={i} key={s}></Skill>
      ))}
      {users.map((u, i) => (
        <User name={u.name} index={i} key={u.id}></User>
      ))}

      {skills.map((s, si) => {
        return users.map((u, ui) => {
          const level = knowledgeLevels.find(
            (lvl) => lvl.skillIndex === si && lvl.userIndex === ui
          );
          return (
            <KnowledgeLevel
              key={s + "_" + u.id}
              level={level?.level ?? 0}
              skillIndex={si}
              userIndex={ui}
              skill={s}
              userId={u.id}
              onUpdateSkill={updateSkillHandler}
            ></KnowledgeLevel>
          );
        });
      })}
    </div>
  );
}

export default MatrixPage;
