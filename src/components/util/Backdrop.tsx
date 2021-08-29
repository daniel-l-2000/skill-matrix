import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/redux';

function Backdrop() {
  const [showClass, setShowClass] = useState(false);
  const [isShowing, setIsShowing] = useState(false);

  const showBackdrop = useSelector(
    (state: RootState) => state.backdrop.showBackdrop
  );

  useEffect(() => {
    if (showBackdrop) {
      setIsShowing(true);
      setTimeout(() => {
        setShowClass(true);
      }, 1);
    } else {
      setShowClass(false);
      setTimeout(() => {
        setIsShowing(false);
      }, 150);
    }
  }, [showBackdrop]);

  return (
    <>
      {isShowing &&
        ReactDOM.createPortal(
          <div className={`modal-backdrop fade ${showClass && 'show'}`}></div>,
          document.getElementById('backdrop-root') as Element
        )}
    </>
  );
}

export default Backdrop;
