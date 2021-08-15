import ReactDOM from "react-dom";

function Backdrop(props: { children?: any }) {
  return (
    <>
      {ReactDOM.createPortal(
        <div className="modal-backdrop fade show">{props.children}</div>,
        document.getElementById("backdrop-root") as Element
      )}
    </>
  );
}

export default Backdrop;
