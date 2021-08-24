import { ChangeEvent } from "react";
import { useState } from "react";

export interface FormControl {
  value: string;
  isValid: boolean;
  hasError: boolean;
  classes: string;
  changeHandler: (ev: ChangeEvent<HTMLInputElement>) => void;
  blurHandler: () => void;
  reset: () => void;
}

function useFormControl(
  validateValue: (value: string) => boolean
): FormControl {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValid = validateValue(enteredValue);
  const hasError = isTouched && !isValid;

  let classes = "form-control";
  if (isTouched && isValid) {
    classes += " is-valid";
  } else if (hasError) {
    classes += " is-invalid";
  }

  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setEnteredValue(ev.target.value);
  };

  const blurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid,
    hasError,
    classes,
    changeHandler,
    blurHandler,
    reset,
  };
}

export default useFormControl;
