import Backdrop from "./Backdrop";
import classes from "./LoadingSpinner.module.css";

function LoadingSpinner() {
  return (
    <>
      <Backdrop />
      <div className={classes.ldsRipple}>
        <div></div>
        <div></div>
      </div>
    </>
  );
}

export default LoadingSpinner;
