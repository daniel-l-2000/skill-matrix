import KnowledgeLevel from "../components/matrix/KnowledgeLevel";
import User from "../components/matrix/User";
import styles from "./Matrix.module.css";
import Skill from "../components/matrix/Skill";
import { useEffect, useState } from "react";
import { firebaseGet } from "../util/firebase";
import { Data } from "../models/data";

function MatrixPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedData, setLoadedData] = useState<Data>();

  useEffect(() => {
    firebaseGet<Data>("/.json").then((data) => {
      setIsLoading(false);
      setLoadedData(data);
    });
  }, []);

  const knowledgeLevels = [
    {
      level: 2,
      skillIndex: 1,
      userIndex: 0
    }
  ];

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
            ></KnowledgeLevel>
          );
        });
      })}
    </div>
  );
}

export default MatrixPage;
