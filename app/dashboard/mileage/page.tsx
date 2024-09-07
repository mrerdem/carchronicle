"use client";
import React, { useState } from "react";
import { VehicleSelector } from "@/app/_components/VehicleSelector";
import { DataInputButton } from "@/app/_components/DataInputButton";
import { DataCard } from "@/app/_components/cards/DataCard";
import { ODOMETER_INFO_PRINTED } from "@/app/constants";
import { MileageOverviewCard } from "@/app/_components/cards/MileageOverviewCard";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import OdometerDataForm from "@/app/_components/forms/OdometerDataForm";
import { selectActiveVehicleData, updateActiveVehicleData } from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import { createClient } from "@/app/_supabase/client";
import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";

export default function Mileage() {
  const [dataToEdit, setDataToEdit] = useState<OdometerData>(null);
  const activeVehicleData = useAppSelector(selectActiveVehicleData);
  const userPrefs = useAppSelector(selectUserPrefs);
  const [odometerFormVisibility, setOdometerFormVisibility] = useState(false);
  const dispatch = useAppDispatch();

  const openOdometerForm = () => {
    setOdometerFormVisibility(true);
  };

  const closeOdometerForm = () => {
    setOdometerFormVisibility(false);
    setDataToEdit(null);
  };

  const handleCardClick = (row: number) => {
    setDataToEdit(activeVehicleData.odometer_data.find((data) => data.row === row));
    openOdometerForm();
  };

  const handleOdometerFormSubmit = async (task: string, user_id: string, formData: OdometerData) => {
    const supabase = createClient();
    if (task === "add") {
      try {
        const { data, error } = await supabase.rpc("add_odometer_data", {
          data: { ...formData, vehicle_row: activeVehicleData.row, user_id: user_id },
        });

        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (data.avgMileage != null) {
              updatedVehicleData.avg_mileage = data.avgMileage;
            }
            if (updatedVehicleData.odometer_data) {
              updatedVehicleData.odometer_data.push({
                ...formData,
                row: data.row,
              });
            } else {
              updatedVehicleData.odometer_data = [
                {
                  ...formData,
                  row: data.row,
                },
              ];
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeOdometerForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (task === "update") {
      try {
        const { data, error } = await supabase.rpc("update_odometer_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });

        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (data.avgMileage != null) {
              updatedVehicleData.avg_mileage = data.avgMileage;
            }
            if (updatedVehicleData.odometer_data) {
              const indexToUpdate = updatedVehicleData.odometer_data.findIndex((odo) => odo.row === data.row);
              if (indexToUpdate != null) {
                updatedVehicleData.odometer_data[indexToUpdate] = formData;
              }
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeOdometerForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (task === "delete") {
      try {
        const { data, error } = await supabase.rpc("delete_odometer_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (data.avgMileage != null) {
              updatedVehicleData.avg_mileage = data.avgMileage;
            }
            if (updatedVehicleData.odometer_data) {
              const indexToDelete = updatedVehicleData.odometer_data.findIndex((odo) => odo.row === data.row);
              if (indexToDelete != null) {
                updatedVehicleData.odometer_data.splice(indexToDelete, 1);
              }
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeOdometerForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div className="data-container">
      {activeVehicleData && (
        <div className="options-container">
          <VehicleSelector />
          <DataInputButton name={"odometer data"} clickAction={openOdometerForm}></DataInputButton>
        </div>
      )}
      <div className="card-container">
        <OdometerDataForm
          open={odometerFormVisibility}
          onSubmit={handleOdometerFormSubmit}
          onClose={closeOdometerForm}
          existingFormData={dataToEdit}
          userPrefs={userPrefs}
        ></OdometerDataForm>
        {MileageOverviewCard(activeVehicleData)}
        {activeVehicleData?.odometer_data && (
          <>
            {activeVehicleData.odometer_data.map((data, index) =>
              DataCard(index + 1, "Odometer data", data, ODOMETER_INFO_PRINTED, userPrefs, handleCardClick)
            )}
          </>
        )}
      </div>
    </div>
  );
}
