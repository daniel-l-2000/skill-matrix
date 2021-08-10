export interface LoadingContextModel {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}
