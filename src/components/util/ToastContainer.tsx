import { useContext } from "react";
import ToastContext from "../../store/toast-context";
import Toast from "./Toast";

function ToastContainer() {
  const toastContext = useContext(ToastContext);

  return (
    <div className="toast-container position-fixed start-0 bottom-0 p-3">
      {toastContext.toasts.map((t) => (
        <Toast
          key={+t.time}
          title={t.title}
          icon={t.icon}
          iconColor={t.iconColor}
          description={t.description}
          time={t.time}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
