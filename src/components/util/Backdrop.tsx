import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function Backdrop(props: { children?: any }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1);
  }, []);

  return (
    <>
      {ReactDOM.createPortal(
        <div className={`modal-backdrop fade ${show && "show"}`}>
          {props.children}
        </div>,
        document.getElementById("backdrop-root") as Element
      )}
    </>
  );
}

export default Backdrop;
