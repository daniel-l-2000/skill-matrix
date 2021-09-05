import User from '../matrix/User';
import classes from './MatrixPage.module.css';
import { useEffect, useReducer } from 'react';
import useDatabase from '../../hooks/use-database';
import UserModel from '../../models/user';
import SkillDefinitionModel from '../../models/skill-definition';
import { Route, useRouteMatch } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import SkillModel from '../../models/skill';
import SkillDefinition from '../matrix/SkillDefinition';
import Skill, { SkillUpdateMode } from '../matrix/Skill';

interface MatrixState {
  users?: UserModel[];
  skillDefinitions?: SkillDefinitionModel[];
  skills?: SkillModel[];
}

type MatrixDispatchActionType =
  | 'INITIALIZE_USERS'
  | 'INITIALIZE_SKILL_DEFINITIONS'
  | 'INITIALIZE_SKILLS'
  | 'CREATE_SKILL'
  | 'UPDATE_SKILL'
  | 'DELETE_SKILL';

interface MatrixDispatchAction {
  type: MatrixDispatchActionType;
  users?: UserModel[];
  skillDefinitions?: SkillDefinitionModel[];
  skills?: SkillModel[];
  skill?: SkillModel;
}

function matrixReducer(
  state: MatrixState,
  action: MatrixDispatchAction
): MatrixState {
  switch (action.type) {
    case 'INITIALIZE_USERS':
      if (action.users) {
        return { ...state, users: action.users };
      }
      throw new Error('users property must be set!');

    case 'INITIALIZE_SKILL_DEFINITIONS':
      if (action.skillDefinitions) {
        return { ...state, skillDefinitions: action.skillDefinitions };
      }
      throw new Error('skillDefinitions property must be set!');

    case 'INITIALIZE_SKILLS':
      if (action.skills) {
        return { ...state, skills: action.skills };
      }
      throw new Error('users property must be set!');

    case 'CREATE_SKILL':
      if (action.skill) {
        return { ...state, skills: [...(state.skills || []), action.skill] };
      }
      throw new Error('skill property must be set!');

    case 'UPDATE_SKILL':
      if (action.skill) {
        const index = state.skills?.findIndex((s) => s.id === action.skill?.id);
        const newSkills = [...(state.skills || [])];
        if (index) {
          newSkills[index] = action.skill;
        }
        return { ...state, skills: [...newSkills] };
      }
      throw new Error('skill property must be set!');

    case 'DELETE_SKILL':
      if (action.skill) {
        return {
          ...state,
          skills: state.skills?.filter((s) => s !== action.skill),
        };
      }
      throw new Error('skill property must be set!');
  }
}

function MatrixPage() {
  const [matrixState, dispatchMatrix] = useReducer(matrixReducer, {});

  const readUsers = useDatabase<UserModel[]>('read', {
    path: '/users/',
  });
  const readSkillDefinitions = useDatabase<SkillDefinitionModel[]>('read', {
    path: '/skillDefinitions/',
  });
  const readSkills = useDatabase<SkillModel[]>('read', {
    path: '/skills/',
  });

  const match = useRouteMatch();

  useEffect(() => {
    readUsers().then((users) => {
      if (users) {
        dispatchMatrix({ type: 'INITIALIZE_USERS', users });
      }
    });
    readSkillDefinitions().then((skillDefinitions) => {
      if (skillDefinitions) {
        dispatchMatrix({
          type: 'INITIALIZE_SKILL_DEFINITIONS',
          skillDefinitions,
        });
      }
    });
    readSkills().then((skills) => {
      if (skills) {
        dispatchMatrix({ type: 'INITIALIZE_SKILLS', skills });
      }
    });
  }, [readUsers, readSkillDefinitions, readSkills]);

  if (!matrixState.users || !matrixState.skillDefinitions) {
    return <div></div>;
  }

  const updateSkillHandler = (skill: SkillModel, mode: SkillUpdateMode) => {
    dispatchMatrix({
      type: `${mode.toUpperCase()}_SKILL` as MatrixDispatchActionType,
      skill,
    });
  };

  return (
    <div className="d-flex">
      <div className={classes.matrixGrid}>
        {matrixState.users.map((u, i) => (
          <User index={i} user={u} key={u.id}></User>
        ))}

        {matrixState.skillDefinitions.map((sd, i) => (
          <SkillDefinition
            name={sd.name}
            index={i}
            key={sd.id}
          ></SkillDefinition>
        ))}

        {matrixState.users.map((u, ui) => {
          return matrixState.skillDefinitions?.map((sd, sdi) => {
            const skill = matrixState.skills?.find(
              (s) => s.userId === u.id && s.skillDefinitionId === sd.id
            );
            return (
              <Skill
                key={`${u.id}_${sd.id}`}
                userIndex={ui}
                skillDefinitionIndex={sdi}
                userId={u.id}
                skillDefinitionId={sd.id}
                skill={skill}
                onUpdateSkill={updateSkillHandler}
              ></Skill>
            );
          });
        })}
      </div>

      <Route path={`${match.path}/profiles/:userId`}>
        <div className="ms-3">
          <ProfilePage />
        </div>
      </Route>
    </div>
  );
}

export default MatrixPage;
