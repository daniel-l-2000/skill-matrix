import { useRef, useState } from "react";
import { FaEdit, FaTimesCircle } from "react-icons/fa";
import { firebaseDelete, firebasePut, getUserId } from "../../util/firebase";
import Backdrop from "../util/Backdrop";
import { KnowledgeLevel as KnowledgeLevelModel } from "../../models/knowledge-level";

function KnowledgeLevel(
  props: KnowledgeLevelModel & {
    skill: string;
    onUpdateSkill: (level: KnowledgeLevelModel) => void;
  }
) {
  const [inEditMode, setInEditMode] = useState(false);

  const levelSelectRef = useRef<HTMLSelectElement>(null);

  let icon = props.level.toString();
  switch (props.level) {
    case 0:
      icon = "";
      break;
    case 1:
      icon = "+";
      break;
    case 2:
      icon = "++";
      break;
    case 3:
      icon = "+++";
      break;
  }

  const toggleEditModeHandler = () => {
    setInEditMode(!inEditMode);
  };

  const selectLevelHandler = () => {
    const selectedLevel = levelSelectRef.current?.value;
    if (selectedLevel === "0") {
      firebaseDelete(
        "/users/" + getUserId() + "/skills/" + props.skill + ".json"
      ).then((_) => {
        console.log("Skill removed");
        setInEditMode(false);
        props.onUpdateSkill({ ...props, level: +selectedLevel });
      });
    } else if (selectedLevel) {
      firebasePut(
        "/users/" + getUserId() + "/skills/" + props.skill + ".json",
        { level: +selectedLevel }
      ).then((_) => {
        console.log("Skill updated");
        setInEditMode(false);
        props.onUpdateSkill({ ...props, level: +selectedLevel });
      });
    }
  };

  return (
    <div
      className="border-start border-top ps-1"
      style={{
        gridColumn: props.skillIndex + 2,
        gridRow: props.userIndex + 2
      }}
    >
      {inEditMode ? (
        <select
          className="form-select form-select-sm d-inline w-auto position-relative before-backdrop"
          onChange={selectLevelHandler}
          value={props.level}
          ref={levelSelectRef}
        >
          <option value={1}>+</option>
          <option value={2}>++</option>
          <option value={3}>+++</option>
          <option value={0}>{icon ? "Remove" : "Select"}</option>
        </select>
      ) : (
        icon
      )}

      <button
        className="btn btn-secondary btn-sm shadow-none border-0 ms-1 position-relative before-backdrop"
        onClick={toggleEditModeHandler}
      >
        {inEditMode ? <FaTimesCircle /> : <FaEdit />}
      </button>

      {inEditMode && <Backdrop />}
    </div>
  );
}

export default KnowledgeLevel;
