import { useCallback, useMemo, useRef, useState } from 'react';
import { FaEdit, FaTimesCircle } from 'react-icons/fa';
import KnowledgeLevelSelector from './KnowledgeLevelSelector';
import { getAuth } from 'firebase/auth';
import useDatabase from '../../hooks/use-database';
import useToasts from '../../hooks/use-toasts';
import { useDispatch } from 'react-redux';
import { backdropActions } from '../../store/redux';

function KnowledgeLevel(props: {
  level: number;
  skillIndex: number;
  userIndex: number;
  skill: string;
  userId: string;
  onUpdateSkill: (userId: string, skill: string, level: number) => void;
}) {
  const [inEditMode, setInEditMode] = useState(false);

  const levelSelectRef = useRef<HTMLSelectElement>(null);

  const dispatch = useDispatch();

  const showToast = useToasts();

  const createSkill = useDatabase(
    `/users/${props.userId}/skills/${props.skill}`,
    'create'
  );
  const deleteSkill = useDatabase(
    `/users/${props.userId}/skills/${props.skill}`,
    'delete'
  );

  const icon = useMemo(() => {
    props.level.toString();
    switch (props.level) {
      case 0:
        return '';
      case 1:
        return '+';
      case 2:
        return '++';
      case 3:
        return '+++';
    }
  }, [props.level]);

  const toggleEditModeHandler = useCallback(() => {
    if (inEditMode) {
      dispatch(backdropActions.hideBackdrop());
    } else {
      dispatch(backdropActions.showBackdrop());
    }
    setInEditMode(!inEditMode);
  }, [dispatch, inEditMode]);

  const selectLevelHandler = useCallback(() => {
    const selectedLevel = levelSelectRef.current?.value;
    if (selectedLevel === '0') {
      deleteSkill().then(() => {
        showToast('Skill removed', 'info');
        setInEditMode(false);
        dispatch(backdropActions.hideBackdrop());
        props.onUpdateSkill(props.userId, props.skill, +selectedLevel);
      });
    } else if (selectedLevel) {
      createSkill({ level: +selectedLevel }).then(() => {
        showToast('Skill updated', 'info');
        setInEditMode(false);
        dispatch(backdropActions.hideBackdrop());
        props.onUpdateSkill(props.userId, props.skill, +selectedLevel);
      });
    }
  }, [showToast, props, createSkill, deleteSkill, dispatch]);

  return (
    <div
      className="border-start border-top d-flex justify-content-center align-items-center"
      style={{
        gridColumn: props.skillIndex + 2,
        gridRow: props.userIndex + 2,
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

      {props.userId === getAuth().currentUser?.uid && (
        <button
          className={`btn btn-outline-dark btn-sm shadow-none border-0 ms-1 ${
            inEditMode && 'position-relative before-backdrop'
          }`}
          onClick={toggleEditModeHandler}
        >
          {inEditMode ? <FaTimesCircle /> : <FaEdit />}
        </button>
      )}
    </div>
  );
}

export default KnowledgeLevel;
