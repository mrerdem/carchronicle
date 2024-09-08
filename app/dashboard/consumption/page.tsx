"use client";
import React, { useState } from "react";
import { VehicleSelector } from "@/app/_components/VehicleSelector";
import { DataInputButton } from "@/app/_components/DataInputButton";
import { DataCard } from "@/app/_components/cards/DataCard";
import { REFUEL_INFO_PRINTED } from "@/app/constants";
import { ConsumptionOverviewCard } from "@/app/_components/cards/ConsumptionOverviewCard";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { selectActiveVehicleData, updateActiveVehicleData } from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import RefuelDataForm from "@/app/_components/forms/RefuelDataForm";
import { createClient } from "@/app/_supabase/client";
import { selectUserPrefs } from "@/app/_redux/features/userPrefs/userPrefsSlice";

export default function Consumption() {
  const [dataToEdit, setDataToEdit] = useState<RefuelData>(null);
  const activeVehicleData = useAppSelector(selectActiveVehicleData);
  const userPrefs = useAppSelector(selectUserPrefs);
  const dispatch = useAppDispatch();

  const [formVisibility, setFormVisibility] = useState(false);

  const openForm = () => {
    setFormVisibility(true);
  };

  const closeForm = () => {
    setFormVisibility(false);
    setDataToEdit(null);
  };

  const handleCardClick = (row: number) => {
    setDataToEdit(activeVehicleData.refuel_data.find((data) => data.row === row));
    openForm();
  };

  const handleFormSubmit = async (task: string, user_id: string, formData: RefuelData) => {
    const supabase = createClient();
    if (task === "add") {
      try {
        const { data, error } = await supabase.rpc("add_refuel_data", {
          data: { ...formData, vehicle_row: activeVehicleData.row, user_id: user_id },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (data.avgConsumption != null) {
              updatedVehicleData.avg_consumption = data.avgConsumption;
            }
            if (updatedVehicleData.refuel_data) {
              updatedVehicleData.refuel_data.push({
                ...formData,
                row: data.row,
              });
            } else {
              updatedVehicleData.refuel_data = [
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
        const { data, error } = await supabase.rpc("update_refuel_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });

        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (data.avgConsumption != null) {
              updatedVehicleData.avg_consumption = data.avgConsumption;
            }
            if (updatedVehicleData.refuel_data) {
              const indexToUpdate = updatedVehicleData.refuel_data.findIndex((refuel) => refuel.row === data.row);
              if (indexToUpdate != null) {
                updatedVehicleData.refuel_data[indexToUpdate] = formData;
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
        const { data, error } = await supabase.rpc("delete_refuel_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (data.avgConsumption != null) {
              updatedVehicleData.avg_consumption = data.avgConsumption;
            }
            if (updatedVehicleData.refuel_data) {
              const indexToDelete = updatedVehicleData.refuel_data.findIndex((refuel) => refuel.row === data.row);
              if (indexToDelete != null) {
                updatedVehicleData.refuel_data.splice(indexToDelete, 1);
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
          {activeVehicleData && <DataInputButton name={"refuel data"} clickAction={openForm}></DataInputButton>}
        </div>
      )}
      <div className="card-container">
        <RefuelDataForm
          open={formVisibility}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          existingFormData={dataToEdit}
          userPrefs={userPrefs}
        ></RefuelDataForm>
        {ConsumptionOverviewCard(activeVehicleData)}
        {activeVehicleData?.refuel_data && (
          <>
            {activeVehicleData.refuel_data.map((data, index) =>
              DataCard(index + 1, "Refuel data", data, REFUEL_INFO_PRINTED, userPrefs, handleCardClick)
            )}
          </>
        )}
      </div>
    </div>
  );
}
