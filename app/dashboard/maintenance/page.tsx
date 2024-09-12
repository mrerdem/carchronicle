"use client";
import React, { useState } from "react";
import { VehicleSelector } from "@/app/_components/VehicleSelector";
import { DataInputButton } from "@/app/_components/DataInputButton";
import { DataCard } from "@/app/_components/cards/DataCard";
import { MAINTENANCE_INFO_PRINTED } from "@/app/constants";
import { MaintenanceOverviewCard } from "@/app/_components/cards/MaintenanceOverviewCard";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import MaintenanceDataForm from "@/app/_components/forms/MaintenanceDataForm";
import {
  selectActiveVehicleData,
  updateActiveVehicleData,
} from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import { createClient } from "@/app/_supabase/client";
import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";

export default function Maintenance() {
  const [dataToEdit, setDataToEdit] = useState<MaintenanceData>(null);
  const activeVehicleData = useAppSelector(selectActiveVehicleData);
  const [formVisibility, setFormVisibility] = useState(false);
  const userPrefs = useAppSelector(selectUserPrefs);
  const dispatch = useAppDispatch();

  const openForm = () => {
    setFormVisibility(true);
  };

  const closeForm = () => {
    setFormVisibility(false);
    setDataToEdit(null);
  };

  const handleCardClick = (row: number) => {
    setDataToEdit(
      activeVehicleData.maintenance_data.find((data) => data.row === row)
    );
    openForm();
  };

  const handleFormSubmit = async (
    task: string,
    user_id: string,
    formData: MaintenanceData
  ) => {
    const supabase = createClient();
    if (task === "add") {
      try {
        const { data, error } = await supabase.rpc("add_maintenance_data", {
          data: {
            ...formData,
            vehicle_row: activeVehicleData.row,
            user_id: user_id,
          },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(
              JSON.stringify(activeVehicleData)
            );
            if (updatedVehicleData.maintenance_data) {
              updatedVehicleData.maintenance_data.push({
                ...formData,
                row: data.row,
              });
            } else {
              updatedVehicleData.maintenance_data = [
                {
                  ...formData,
                  row: data.row,
                },
              ];
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (task === "update") {
      try {
        const { data, error } = await supabase.rpc("update_maintenance_data", {
          data: {
            ...formData,
            user_id: user_id,
            vehicle_row: activeVehicleData.row,
          },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(
              JSON.stringify(activeVehicleData)
            );
            if (updatedVehicleData.maintenance_data) {
              const indexToUpdate =
                updatedVehicleData.maintenance_data.findIndex(
                  (maint) => maint.row === data.row
                );
              if (indexToUpdate != null) {
                updatedVehicleData.maintenance_data[indexToUpdate] = formData;
              }
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeForm();
          }
        } else {
          throw new Error("API response failed");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (task === "delete") {
      try {
        const { data, error } = await supabase.rpc("delete_maintenance_data", {
          data: {
            ...formData,
            user_id: user_id,
            vehicle_row: activeVehicleData.row,
          },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(
              JSON.stringify(activeVehicleData)
            );
            if (updatedVehicleData.maintenance_data) {
              const indexToDelete =
                updatedVehicleData.maintenance_data.findIndex(
                  (maint) => maint.row === data.row
                );
              if (indexToDelete != null) {
                updatedVehicleData.maintenance_data.splice(indexToDelete, 1);
              }
            }
            dispatch(updateActiveVehicleData(updatedVehicleData));
            closeForm();
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
          <DataInputButton
            name={"maintenance"}
            clickAction={openForm}
          ></DataInputButton>
        </div>
      )}
      <div className="card-container">
        <MaintenanceDataForm
          open={formVisibility}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          existingFormData={dataToEdit}
          userPrefs={userPrefs}
        ></MaintenanceDataForm>
        {MaintenanceOverviewCard(activeVehicleData)}
        {activeVehicleData?.maintenance_data && (
          <>
            {activeVehicleData.maintenance_data.map((data, index) =>
              DataCard(
                index + 1,
                "Maintenance/Repair",
                data,
                MAINTENANCE_INFO_PRINTED,
                userPrefs,
                handleCardClick
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
