import classes from './LoadingSpinner.module.css';

function LoadingSpinner() {
  return (
    <div className={`before-backdrop ${classes.ldsRipple}`}>
      <div></div>
      <div></div>
    </div>
  );
}

export default LoadingSpinner;
