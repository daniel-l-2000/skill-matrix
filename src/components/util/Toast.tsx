import {
  FaBeer,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { ToastData } from "../../store/toast-context-model";

function Toast(props: ToastData) {
  let icon = <FaBeer />;
  switch (props.icon) {
    case "info":
      icon = <FaInfoCircle />;
      break;
    case "success":
      icon = <FaCheckCircle />;
      break;
    case "warning":
      icon = <FaExclamationTriangle />;
      break;
    case "danger":
      icon = <FaExclamationCircle />;
      break;
  }

  return (
    <div className="toast show" role="alert">
      <div className="toast-header">
        <small className={"me-1 text-" + props.icon}>{icon}</small>
        <strong className="me-auto">{props.title}</strong>
        <small className="text-muted">{props.time.toLocaleTimeString()}</small>
      </div>
      {props.description && (
        <div className="toast-body">{props.description}</div>
      )}
    </div>
  );
}

export default Toast;
