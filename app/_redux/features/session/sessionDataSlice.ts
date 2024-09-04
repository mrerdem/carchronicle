// Data storage for user session

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SessionDataState {
  email: string;
  id: string;
}

const initialState: SessionDataState = {
  email: "",
  id: "",
};

export const sessionDataSlice = createSlice({
  name: "sessionData",
  initialState,
  reducers: {
    setSessionData: (state, action: PayloadAction<SessionDataState>) => {
      state.email = action.payload.email;
      state.id = action.payload.id;
    },
    resetSessionData: () => {
      return initialState;
    },
  },
  selectors: {
    selectSessionData: (sessionData) => sessionData,
  },
});

export const { setSessionData, resetSessionData } = sessionDataSlice.actions;

export const { selectSessionData } = sessionDataSlice.selectors;
