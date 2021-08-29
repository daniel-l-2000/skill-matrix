import { createContext, useState } from 'react';

export interface LoadingContextModel {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextModel>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export function LoadingContextProvider(props: { children: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const context: LoadingContextModel = { isLoading, startLoading, stopLoading };

  return (
    <LoadingContext.Provider value={context}>
      {props.children}
    </LoadingContext.Provider>
  );
}

export default LoadingContext;
