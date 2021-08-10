import { createContext, useContext, useState } from "react";
import LoadingContext from "./loading-context";
import { IconType, ToastContextModel, ToastData } from "./toast-context-model";

const ToastContext = createContext<ToastContextModel>({
  toasts: [],
  showToast: () => {}
});

export function ToastContextProvider(props: { children: any }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const loadingContext = useContext(LoadingContext);

  const showToast = (title: string, icon: IconType, description?: string) => {
    const toast: ToastData = {
      title,
      icon,
      description,
      time: new Date()
    };
    setToasts((prev) => [...prev, toast]);
    loadingContext.stopLoading();
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
