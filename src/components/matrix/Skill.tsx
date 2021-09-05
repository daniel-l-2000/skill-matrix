import { useCallback, useMemo, useRef, useState } from 'react';
import { FaEdit, FaTimesCircle } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import useDatabase from '../../hooks/use-database';
import { useDispatch } from 'react-redux';
import { backdropActions, showAndPopToast } from '../../store/redux';
import LevelSelector from './LevelSelector';
import SkillModel from '../../models/skill';
import { useEffect } from 'react';

export type SkillUpdateMode = 'create' | 'update' | 'delete';

function Skill(props: {
  userIndex: number;
  skillDefinitionIndex: number;
  userId: string;
  skillDefinitionId: string;
  skill?: SkillModel;
  onUpdateSkill: (skill: SkillModel, mode: SkillUpdateMode) => void;
}) {
  const [inEditMode, setInEditMode] = useState(false);
  const [skill, setSkill] = useState(props.skill);

  const levelSelectRef = useRef<HTMLSelectElement>(null);

  const dispatch = useDispatch();

  const createSkill = useDatabase('create', { path: '/skills' });
  const updateSkill = useDatabase('update');
  const deleteSkill = useDatabase('delete');

  useEffect(() => {
    setSkill(props.skill);
  }, [props.skill]);

  const icon = useMemo(() => {
    switch (skill?.level) {
      case 1:
        return '+';
      case 2:
        return '++';
      case 3:
        return '+++';
      default:
        return '';
    }
  }, [skill?.level]);

  const toggleEditModeHandler = useCallback(() => {
    if (inEditMode) {
      dispatch(backdropActions.hideBackdrop());
    } else {
      dispatch(backdropActions.showBackdrop());
    }
    setInEditMode(!inEditMode);
  }, [dispatch, inEditMode]);

  const selectLevelHandler = async () => {
    const selectedLevel = +(levelSelectRef.current?.value || '');
    console.log(!!skill, selectedLevel);
    if (!skill && selectedLevel) {
      const data = {
        userId: props.userId,
        skillDefinitionId: props.skillDefinitionId,
        level: selectedLevel,
      };
      const id = await createSkill({ data });
      toggleEditModeHandler();
      const createdSkill = { id, ...data };
      props.onUpdateSkill(createdSkill, 'create');
      setSkill(createdSkill);
      dispatch(showAndPopToast('Skill created', 'info'));
    } else if (skill && selectedLevel) {
      await updateSkill({
        path: `/skills/${skill.id}`,
        data: { level: selectedLevel },
      });
      toggleEditModeHandler();
      const updatedSkill = { ...skill, level: selectedLevel };
      props.onUpdateSkill(updatedSkill, 'update');
      setSkill(updatedSkill);
      dispatch(showAndPopToast('Skill updated', 'info'));
    } else if (skill && !selectedLevel) {
      await deleteSkill({ path: `/skills/${skill.id}` });
      toggleEditModeHandler();
      props.onUpdateSkill(skill, 'delete');
      setSkill(undefined);
      dispatch(showAndPopToast('Skill deleted', 'info'));
    }
  };

  return (
    <div
      className="border-start border-top d-flex justify-content-center align-items-center"
      style={{
        gridColumn: props.skillDefinitionIndex + 2,
        gridRow: props.userIndex + 2,
      }}
    >
      {inEditMode ? (
        <LevelSelector
          onChange={selectLevelHandler}
          initialValue={skill?.level}
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

export default Skill;
