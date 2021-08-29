import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IconType = 'info' | 'success' | 'warning' | 'danger';

export interface ToastData {
  title: string;
  icon: IconType;
  description?: string;
  timestamp: number;
}

export interface ToastState {
  toasts: ToastData[];
}

export interface ShowToastAction {
  title: string;
  icon: IconType;
  description?: string;
}

function showToast(state: ToastState, action: PayloadAction<ShowToastAction>) {
  const toast: ToastData = {
    timestamp: Date.now(),
    title: action.payload.title,
    icon: action.payload.icon,
    description: action.payload.description,
  };
  state.toasts.push(toast);
}

function popToast(state: ToastState) {
  state.toasts.shift();
}

const toastsSlice = createSlice({
  name: 'toasts',
  initialState: { toasts: [] } as ToastState,
  reducers: { showToast, popToast },
});

export interface BackdropState {
  showBackdrop: boolean;
}

function showBackdrop(state: BackdropState) {
  state.showBackdrop = true;
}

function hideBackdrop(state: BackdropState) {
  state.showBackdrop = false;
}

const backdropSlice = createSlice({
  name: 'backdrop',
  initialState: { showBackdrop: false } as BackdropState,
  reducers: { showBackdrop, hideBackdrop },
});

const store = configureStore({
  reducer: {
    toasts: toastsSlice.reducer,
    backdrop: backdropSlice.reducer,
  },
});

export const toastActions = toastsSlice.actions;

export const backdropActions = backdropSlice.actions;

export type RootState = ReturnType<typeof store.getState>;

export default store;
