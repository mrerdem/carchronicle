// Data storage for all vehicles. Data is fetched as needed.
import { createClient } from "@/app/_supabase/client";
import { asyncThunkCreator, buildCreateSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface UserPrefsFetchState {
  prefs: UserPrefs;
  status: "none" | "idle" | "pending" | "failure";
  error: string | null;
}

export const initialState: UserPrefsFetchState = {
  prefs: null,
  status: "none",
  error: null,
};

// Asynchronous fetch for user prefs
export const getUserPrefs = createAsyncThunk("userPrefs/getUserPrefs", async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_user_prefs");
    if (!error) {
      return data;
    } else {
      throw new Error("API response failed");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
});

// Asynchronous call to set user prefs
export const setUserPrefs = createAsyncThunk(
  "userPrefs/setUserPrefs",
  async (params: { user_id: string; data: UserPrefs }) => {
    try {
      if (params.user_id === "" || params.data === null) {
        throw new Error("Parameter error");
      }

      const supabase = createClient();
      const { data, error } = await supabase.rpc("set_user_prefs", {
        data: { ...params.data, user_id: params.user_id },
      });

      if (!error) {
        if (data?.result) {
          return { ...params.data };
        } else {
          throw new Error("API response failed");
        }
      } else {
        throw new Error("API response failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
);

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const userPrefsSlice = createAppSlice({
  name: "userPrefs",
  initialState,
  reducers: () => ({}),
  extraReducers: (builder) => {
    builder
      .addCase(getUserPrefs.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getUserPrefs.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload != null) {
          state.prefs = action.payload;
        }
      })
      .addCase(getUserPrefs.rejected, (state) => {
        state.status = "failure";
      })
      .addCase(setUserPrefs.pending, (state) => {
        state.status = "pending";
      })
      .addCase(setUserPrefs.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload != null) {
          state.prefs = action.payload;
        }
      })
      .addCase(setUserPrefs.rejected, (state) => {
        state.status = "failure";
      });
  },
  selectors: {
    selectUserPrefs: (userPrefs) => userPrefs.prefs,
    selectUserPrefsFetchState: (userPrefs) => userPrefs.status,
  },
});

export const {} = userPrefsSlice.actions;

export const { selectUserPrefs, selectUserPrefsFetchState } = userPrefsSlice.selectors;
