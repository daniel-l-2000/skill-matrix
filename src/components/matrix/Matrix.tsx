import KnowledgeLevel from "./KnowledgeLevel";
import Person from "./Person";
import styles from "./Matrix.module.css";
import Skill from "./Skill";

function Matrix() {
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

  return (
    <div className={styles.matrixGrid}>
      <Skill name={skills[0].name} index={0}></Skill>
      <Skill name={skills[1].name} index={1}></Skill>
      <Skill name={skills[2].name} index={2}></Skill>

      <Person name={people[0].name} index={0}></Person>
      <Person name={people[1].name} index={1}></Person>

      {skills.map((q, si) => {
        return people.map((p, pi) => {
          const level = knowledgeLevels.find(
            (lvl) => lvl.skillIndex === si && lvl.personIndex === pi
          );
          return (
            <KnowledgeLevel
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

export default Matrix;
