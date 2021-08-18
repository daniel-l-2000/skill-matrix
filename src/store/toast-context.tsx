import { createContext, useState } from "react";
import { IconType, ToastContextModel, ToastData } from "./toast-context-model";

const ToastContext = createContext<ToastContextModel>({
  toasts: [],
  showToast: () => {}
});

export function ToastContextProvider(props: { children: any }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (title: string, icon: IconType, description?: string) => {
    const toast: ToastData = {
      title,
      icon,
      description,
      timestamp: new Date()
    };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== toast));
    }, 3000);
  };

  const context: ToastContextModel = { toasts, showToast };

  return (
    <ToastContext.Provider value={context}>
      {props.children}
    </ToastContext.Provider>
  );
}

export default ToastContext;
