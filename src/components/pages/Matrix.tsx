import KnowledgeLevel from "../matrix/KnowledgeLevel";
import User from "../matrix/User";
import styles from "./Matrix.module.css";
import Skill from "../matrix/Skill";
import { useEffect, useState } from "react";
import { firebaseGet, getUserId } from "../../util/firebase";
import { Data } from "../../models/data";
import { KnowledgeLevel as KnowledgeLevelModel } from "../../models/knowledge-level";

function MatrixPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedData, setLoadedData] = useState<Data>();

  useEffect(() => {
    firebaseGet<Data>("/.json").then((data) => {
      setIsLoading(false);
      setLoadedData(data);
    });
  }, []);

  if (isLoading || !loadedData) {
    return <p>Loading...</p>;
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
  for (const userName of users) {
    const user = loadedData.users[getUserId()];
    for (const skill in user.skills) {
      const level = user.skills[skill].level;
      knowledgeLevels.push({
        level,
        skillIndex: skills.indexOf(skill),
        userIndex: users.indexOf(userName)
      });
    }
  }

  const updateSkillHandler = (level: KnowledgeLevelModel) => {
    console.log(level);
  };

  return (
    <div className={styles.matrixGrid}>
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
              skillName={s}
              onUpdateSkill={updateSkillHandler}
            ></KnowledgeLevel>
          );
        });
      })}
    </div>
  );
}

export default MatrixPage;
