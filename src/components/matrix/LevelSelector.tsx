import { forwardRef } from 'react';

const LevelSelector = forwardRef<HTMLSelectElement, any>(
  (
    props: {
      initialValue: number | undefined;
      onChange: () => void;
    },
    ref
  ) => {
    return (
      <select
        className="form-select form-select-sm d-inline w-auto position-relative before-backdrop"
        onChange={props.onChange}
        value={props.initialValue}
        ref={ref}
      >
        <option value={undefined}>
          {props.initialValue ? 'Remove' : 'Select'}
        </option>
        <option value={1}>+</option>
        <option value={2}>++</option>
        <option value={3}>+++</option>
      </select>
    );
  }
);

export default LevelSelector;
