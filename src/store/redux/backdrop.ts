import { createSlice } from '@reduxjs/toolkit';

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

export const backdropActions = backdropSlice.actions;

export default backdropSlice.reducer;
