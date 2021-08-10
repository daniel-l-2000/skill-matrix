import { createContext, useState } from "react";
import { LoadingContextModel } from "./loading-context-model";

const LoadingContext = createContext<LoadingContextModel>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {}
});

export function LoadingContextProvider(props: { children: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading((prev) => true);
  };

  const stopLoading = () => {
    setIsLoading((prev) => false);
  };

  const context: LoadingContextModel = { isLoading, startLoading, stopLoading };

  return (
    <LoadingContext.Provider value={context}>
      {props.children}
    </LoadingContext.Provider>
  );
}

export default LoadingContext;
