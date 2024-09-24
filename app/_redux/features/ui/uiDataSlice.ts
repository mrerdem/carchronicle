// Data storage for ui

import { createSlice } from "@reduxjs/toolkit";

export interface UiDataState {
  mobileLayout: boolean;
  userPrefsFormVisibility: boolean;
  loginFormVisibility: boolean;
}

const initialState: UiDataState = {
  mobileLayout: false,
  userPrefsFormVisibility: false,
  loginFormVisibility: false,
};

export const uiDataSlice = createSlice({
  name: "uiData",
  initialState,
  reducers: {
    setUiData: (state, action) => {
      return action.payload;
    },
  },
  selectors: {
    selectUiData: (uiData) => uiData,
  },
});

export const { setUiData } = uiDataSlice.actions;

export const { selectUiData } = uiDataSlice.selectors;
