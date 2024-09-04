// Data storage for ui

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiDataState {
  mobileLayout: boolean;
}

const initialState: UiDataState = {
  mobileLayout: false,
};

export const uiDataSlice = createSlice({
  name: "uiData",
  initialState,
  reducers: {
    setUiData: (state, action: PayloadAction<UiDataState>) => {
      state.mobileLayout = action.payload.mobileLayout;
    },
  },
  selectors: {
    selectUiData: (uiData) => uiData,
  },
});

export const { setUiData } = uiDataSlice.actions;

export const { selectUiData } = uiDataSlice.selectors;
