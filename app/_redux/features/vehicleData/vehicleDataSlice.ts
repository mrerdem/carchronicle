// Data storage for all vehicles. Data is fetched as needed.
import { createClient } from "@/app/_supabase/client";
import { asyncThunkCreator, buildCreateSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface VehicleDataFetchState {
  items: VehicleData[];
  status: "idle" | "pending" | "failure";
  error: string | null;
  activeVehicleIndex: number;
}

export const initialState: VehicleDataFetchState = {
  items: [],
  status: "idle",
  error: null,
  activeVehicleIndex: -1,
};

// Asynchronous fetch for vehicle list data.
export const getVehicleList = createAsyncThunk("vehicleData/getVehicleList", async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_vehicle_list");
    if (!error) {
      return data;
    } else {
      throw new Error("API response failed");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
});

// Asynchronous fetch for single vehicle detailed data.
export const getVehicleDetails = createAsyncThunk(
  "vehicleData/getVehicleDetail",
  async (params: { user_id: string; row: number }) => {
    try {
      if (params.user_id === "" || params.row === null) {
        throw new Error("Parameter error");
      }

      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_vehicle_data", {
        data: { user_id: params.user_id, row: params.row },
      });

      if (!error) {
        if (data != null) {
          const vehicle: VehicleData = data;
          return vehicle;
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

// Asynchronous call to add new vehicle.
export const addVehicle = createAsyncThunk(
  "vehicleData/addVehicle",
  async (params: { user_id: string; data: VehicleData }) => {
    try {
      if (params.user_id === "" || params.data === null) {
        throw new Error("Parameter error");
      }

      const supabase = createClient();
      const { data, error } = await supabase.rpc("add_vehicle", { data: { ...params.data, user_id: params.user_id } });

      if (!error) {
        if (data?.row != undefined) {
          return { ...params.data, row: data.row };
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

// Asynchronous call to delete a vehicle.
export const deleteVehicle = createAsyncThunk(
  "vehicleData/deleteVehicle",
  async (params: { user_id: string; row: number | null }) => {
    try {
      if (params.user_id === "" || params.row === null) {
        throw new Error("Parameter error");
      }

      const supabase = createClient();
      const { data, error } = await supabase.rpc("delete_vehicle", {
        data: { user_id: params.user_id, row: params.row },
      });

      if (!error) {
        if (data?.row != undefined) {
          return data.row;
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

// Asynchronous call to update a vehicle.
export const updateVehicle = createAsyncThunk(
  "vehicleData/updateVehicle",
  async (params: { user_id: string; data: VehicleData }) => {
    try {
      if (params.user_id === "" || params.data === null) {
        throw new Error("Parameter error");
      }

      const supabase = createClient();
      const { data, error } = await supabase.rpc("update_vehicle", {
        data: { user_id: params.user_id, ...params.data },
      });

      if (!error) {
        if (data != null) {
          return { data: params.data };
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

export const vehicleDataSlice = createAppSlice({
  name: "vehicleData",
  initialState,
  reducers: () => ({
    resetAllVehicleData: () => {
      return initialState;
    },
    activateVehicleByRow: (state, action) => {
      state.activeVehicleIndex = state.items.findIndex((item) => item.row === action.payload);
    },
    activateVehicleByIndex: (state, action) => {
      state.activeVehicleIndex = action.payload;
    },
    updateActiveVehicleData: (state, action) => {
      state.items[state.activeVehicleIndex] = action.payload;
    },
  }),
  extraReducers: (builder) => {
    builder
      .addCase(getVehicleList.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getVehicleList.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload != null) {
          state.items = action.payload;
        }
      })
      .addCase(getVehicleList.rejected, (state) => {
        state.status = "failure";
      })
      .addCase(getVehicleDetails.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getVehicleDetails.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload != null) {
          const existing_index = state.items.findIndex((item) => item.row === action.payload?.row);
          if (existing_index > -1) {
            state.items[existing_index] = { ...action.payload, details: true };
          } else {
            state.items.push(action.payload);
          }
        }
      })
      .addCase(getVehicleDetails.rejected, (state) => {
        state.status = "failure";
      })
      .addCase(addVehicle.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload != null) {
          state.items.push({ ...action.payload, details: true });
        }
      })
      .addCase(addVehicle.rejected, (state) => {
        state.status = "failure";
      })
      .addCase(deleteVehicle.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload != null) {
          const indexToDelete = state.items.findIndex((item) => item.row === action.payload);
          state.items.splice(indexToDelete, 1);
          state.activeVehicleIndex = -1;
        }
      })
      .addCase(deleteVehicle.rejected, (state) => {
        state.status = "failure";
      })
      .addCase(updateVehicle.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload != null) {
          const indexToUpdate = state.items.findIndex((item) => item.row === action.payload?.data.row);
          state.items[indexToUpdate] = action.payload.data;
        }
      })
      .addCase(updateVehicle.rejected, (state) => {
        state.status = "failure";
      });
  },
  selectors: {
    selectVehicleData: (vehicleData) => vehicleData.items,
    selectActiveVehicleIndex: (vehicleList) => vehicleList.activeVehicleIndex,
    selectActiveVehicleData: (vehicleData) =>
      vehicleData.activeVehicleIndex > -1 ? vehicleData.items[vehicleData.activeVehicleIndex] : null,
    selectStatus: (vehicleData) => vehicleData.status,
  },
});

export const { resetAllVehicleData, activateVehicleByRow, activateVehicleByIndex, updateActiveVehicleData } =
  vehicleDataSlice.actions;

export const { selectActiveVehicleData, selectVehicleData, selectStatus, selectActiveVehicleIndex } =
  vehicleDataSlice.selectors;
