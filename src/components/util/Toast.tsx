import { ToastData } from "../../store/toast-context-model";

function Toast(props: ToastData) {
  return (
    <div className="toast show" role="alert">
      <div className="toast-header">
        {/* <img src="..." className="rounded me-2" alt="..."></img> */}
        <strong className="me-auto">{props.title}</strong>
        <small className="text-muted">{props.time.toLocaleTimeString()}</small>
      </div>
      <div className="toast-body">{props.description} </div>
    </div>
  );
}

export default Toast;
