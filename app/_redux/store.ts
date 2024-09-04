import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { vehicleDataSlice } from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import { sessionDataSlice } from "@/app/_redux/features/session/sessionDataSlice";
import { uiDataSlice } from "@/app/_redux/features/ui/uiDataSlice";

const rootReducer = combineSlices(vehicleDataSlice, sessionDataSlice, uiDataSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
