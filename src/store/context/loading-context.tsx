import { createContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { backdropActions } from '../redux';

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

  const dispatch = useDispatch();

  const startLoading = () => {
    setIsLoading(true);
    dispatch(backdropActions.showBackdrop());
  };

  const stopLoading = () => {
    setIsLoading(false);
    dispatch(backdropActions.hideBackdrop());
  };

  const context: LoadingContextModel = { isLoading, startLoading, stopLoading };

  return (
    <LoadingContext.Provider value={context}>
      {props.children}
    </LoadingContext.Provider>
  );
}

export default LoadingContext;
