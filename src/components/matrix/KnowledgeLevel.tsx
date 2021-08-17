import { useCallback, useContext, useRef, useState } from "react";
import { FaEdit, FaTimesCircle } from "react-icons/fa";
import { httpDelete, httpPut } from "../../api/http";
import { getUserId } from "../../api/auth";
import Backdrop from "../util/Backdrop";
import ToastContext from "../../store/toast-context";
import { useHistory } from "react-router-dom";
import KnowledgeLevelSelector from "./KnowledgeLevelSelector";

function KnowledgeLevel(props: {
  level: number;
  skillIndex: number;
  userIndex: number;
  skill: string;
  userId: string;
  onUpdateSkill: (level: number, skillIndex: number, userIndex: number) => void;
}) {
  const [inEditMode, setInEditMode] = useState(false);

  const levelSelectRef = useRef<HTMLSelectElement>(null);

  const toastContext = useContext(ToastContext);

  const history = useHistory();

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

  const toggleEditModeHandler = useCallback(() => {
    setInEditMode((prev) => !prev);
  }, []);

  const selectLevelHandler = useCallback(() => {
    const selectedLevel = levelSelectRef.current?.value;
    if (selectedLevel === "0") {
      httpDelete(`/users/${props.userId}/skills/${props.skill}.json`, {
        toastContext,
        history
      }).then(() => {
        toastContext.showToast("Skill removed", "info");
        setInEditMode(false);
        props.onUpdateSkill(+selectedLevel, props.skillIndex, props.userIndex);
      });
    } else if (selectedLevel) {
      httpPut(`/users/${props.userId}/skills/${props.skill}.json`, {
        toastContext,
        history,
        body: { level: +selectedLevel }
      }).then(() => {
        toastContext.showToast("Skill updated", "info");
        setInEditMode(false);
        props.onUpdateSkill(+selectedLevel, props.skillIndex, props.userIndex);
      });
    }
  }, [toastContext, history, props]);

  return (
    <div
      className="border-start border-top d-flex justify-content-center align-items-center"
      style={{
        gridColumn: props.skillIndex + 2,
        gridRow: props.userIndex + 2
      }}
    >
      {inEditMode ? (
        <KnowledgeLevelSelector
          onChange={selectLevelHandler}
          initialValue={props.level}
          ref={levelSelectRef}
        />
      ) : (
        icon
      )}

      {props.userId === getUserId() && (
        <button
          className={`btn btn-outline-dark btn-sm shadow-none border-0 ms-1 ${
            inEditMode && "position-relative before-backdrop"
          }`}
          onClick={toggleEditModeHandler}
        >
          {inEditMode ? <FaTimesCircle /> : <FaEdit />}
        </button>
      )}

      {inEditMode && <Backdrop />}
    </div>
  );
}

export default KnowledgeLevel;
