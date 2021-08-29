import { configureStore } from '@reduxjs/toolkit';
import toastsReducer from './toast';
import backdropReducer from './backdrop';

const store = configureStore({
  reducer: {
    toasts: toastsReducer,
    backdrop: backdropReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

export * from './toast';
export * from './backdrop';
