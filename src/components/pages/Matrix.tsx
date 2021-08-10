import KnowledgeLevel from "../matrix/KnowledgeLevel";
import User from "../matrix/User";
import classes from "./Matrix.module.css";
import Skill from "../matrix/Skill";
import { useContext, useEffect, useState } from "react";
import { firebaseGet } from "../../util/firebase";
import { Data } from "../../models/data";
import { KnowledgeLevel as KnowledgeLevelModel } from "../../models/knowledge-level";
import LoadingContext from "../../store/loading-context";
import { getUserId } from "../../util/identitytoolkit";
import { useHistory } from "react-router-dom";
import ToastContext from "../../store/toast-context";

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
  for (const skill in loadedData.skills) {
    skills.push(skill);
  }

  const users: string[] = [];
  for (const user in loadedData?.users) {
    users.push(loadedData.users[user].name);
  }

  const knowledgeLevels: KnowledgeLevelModel[] = [];
  for (const user of users) {
    const userModel = loadedData.users[getUserId()];
    for (const skill in userModel.skills) {
      const level = userModel.skills[skill].level;
      knowledgeLevels.push({
        level,
        skillIndex: skills.indexOf(skill),
        userIndex: users.indexOf(user)
      });
    }
  }

  const updateSkillHandler = (level: KnowledgeLevelModel) => {
    const skill = skills[level.skillIndex];
    const user = loadedData.users[getUserId()];
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
        <User name={u} index={i} key={u}></User>
      ))}

      {skills.map((s, si) => {
        return users.map((u, ui) => {
          const level = knowledgeLevels.find(
            (lvl) => lvl.skillIndex === si && lvl.userIndex === ui
          );
          return (
            <KnowledgeLevel
              key={si + "_" + ui}
              level={level?.level ?? 0}
              skillIndex={si}
              userIndex={ui}
              skill={s}
              onUpdateSkill={updateSkillHandler}
            ></KnowledgeLevel>
          );
        });
      })}
    </div>
  );
}

export default MatrixPage;
