import KnowledgeLevel from "../components/matrix/KnowledgeLevel";
import Person from "../components/matrix/Person";
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
      console.log(data);
    });
  }, []);

  const skills = [
    {
      id: 101,
      name: "Angular"
    },
    {
      id: 102,
      name: "React"
    },
    {
      id: 103,
      name: "Firebase"
    }
  ];

  const people = [
    {
      id: 201,
      name: "Daniel"
    },
    {
      id: 202,
      name: "Max"
    }
  ];

  const knowledgeLevels = [
    {
      level: 2,
      skillIndex: 1,
      personIndex: 0
    }
  ];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.matrixGrid}>
      {skills.map((s, i) => (
        <Skill name={s.name} index={i} key={s.id}></Skill>
      ))}
      {people.map((p, i) => (
        <Person name={p.name} index={i} key={p.id}></Person>
      ))}

      {skills.map((s, si) => {
        return people.map((p, pi) => {
          const level = knowledgeLevels.find(
            (lvl) => lvl.skillIndex === si && lvl.personIndex === pi
          );
          return (
            <KnowledgeLevel
              key={si + "_" + pi}
              level={level?.level ?? 0}
              skillIndex={si}
              personIndex={pi}
            ></KnowledgeLevel>
          );
        });
      })}
    </div>
  );
}

export default MatrixPage;
