import { useContext } from "react";
import ToastContext from "../../store/toast-context";
import Toast from "./Toast";

function ToastContainer() {
  const toastContext = useContext(ToastContext);

  return (
    <div className="toast-container position-fixed before-backdrop start-0 bottom-0 p-3">
      {toastContext.toasts.map((t) => (
        <Toast
          key={+t.timestamp}
          title={t.title}
          icon={t.icon}
          description={t.description}
          timestamp={t.timestamp}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
