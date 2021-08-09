import { useRef, useState } from "react";
import { FaEdit, FaTimesCircle } from "react-icons/fa";
import Backdrop from "../helper/Backdrop";

function KnowledgeLevel(props: {
  level: number;
  skillIndex: number;
  personIndex: number;
}) {
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
    console.log(levelSelectRef.current?.value);
    setInEditMode(false);
  };

  return (
    <div
      className="border-start border-top ps-1"
      style={{
        gridColumn: props.skillIndex + 2,
        gridRow: props.personIndex + 2
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
          <option value={0}>Remove</option>
        </select>
      ) : (
        icon
      )}

      <button
        className={
          "btn btn-" +
          (inEditMode ? "" : "outline-") +
          "secondary btn-sm shadow-none border-0 ms-1 position-relative before-backdrop"
        }
        onClick={toggleEditModeHandler}
      >
        {inEditMode ? <FaTimesCircle /> : <FaEdit />}
      </button>

      {inEditMode && <Backdrop />}
    </div>
  );
}

export default KnowledgeLevel;
