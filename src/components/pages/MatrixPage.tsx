import KnowledgeLevel from "../matrix/KnowledgeLevel";
import User from "../matrix/User";
import classes from "./MatrixPage.module.css";
import Skill from "../matrix/Skill";
import { useContext, useEffect, useState } from "react";
import { httpGet } from "../../api/firebase";
import { Data } from "../../api/models/data";
import LoadingContext from "../../store/loading-context";
import { useHistory } from "react-router-dom";
import ToastContext from "../../store/toast-context";

function MatrixPage() {
  const [loadedData, setLoadedData] = useState<Data>();

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);

  const history = useHistory();

  useEffect(() => {
    loadingContext.startLoading();
    httpGet<Data>("/.json", { toastContext, history }).then((data) => {
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

  const userIds: string[] = [];
  for (const userId in loadedData.users) {
    userIds.push(userId);
  }

  const updateSkillHandler = (
    level: number,
    skillIndex: number,
    userIndex: number
  ) => {
    setLoadedData((prev) => {
      const skill = skills[skillIndex];
      const user = prev?.users && prev.users[userIds[userIndex]];
      if (user) {
        if (user.skills) {
          user.skills[skill] = { level };
        } else {
          user.skills = { [skill]: { level } };
        }
      }
      return { ...prev };
    });
  };

  return (
    <div className={classes.matrixGrid}>
      {skills.map((s, i) => (
        <Skill name={s} index={i} key={s}></Skill>
      ))}
      {userIds.map((id, i) => {
        const user = loadedData.users && loadedData.users[id];
        if (user?.name) {
          return (
            <User
              index={i}
              id={id}
              name={user.name}
              profilePictureToken={user.profilePictureToken}
              key={id}
            ></User>
          );
        }
        return null;
      })}

      {skills.map((s, si) => {
        return userIds.map((uid, ui) => {
          const user = loadedData.users && loadedData.users[uid];
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
