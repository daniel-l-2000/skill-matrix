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

export interface ShowToastData {
  title: string;
  icon: IconType;
  description?: string;
}

function showToast(state: ToastState, action: PayloadAction<ShowToastData>) {
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

const store = configureStore({ reducer: { toasts: toastsSlice.reducer } });

export const toastActions = toastsSlice.actions;

export type RootState = ReturnType<typeof store.getState>;

export default store;
