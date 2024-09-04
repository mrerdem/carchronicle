"use client";
import React, { useState } from "react";
import { VehicleSelector } from "@/app/_components/VehicleSelector";
import { DataInputButton } from "@/app/_components/DataInputButton";
import { DataCard } from "@/app/_components/cards/DataCard";
import { INSURANCE_INFO_PRINTED } from "@/app/constants";
import { InsuranceOverviewCard } from "@/app/_components/cards/InsuranceOverviewCard";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import InsuranceDataForm from "@/app/_components/forms/InsuranceDataForm";
import { selectActiveVehicleData, updateActiveVehicleData } from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import { createClient } from "@/app/_supabase/client";

export default function Insurance() {
  const [dataToEdit, setDataToEdit] = useState<InsuranceData>(null);
  const activeVehicleData = useAppSelector(selectActiveVehicleData);
  const [formVisibility, setFormVisibility] = useState(false);
  const dispatch = useAppDispatch();

  const openForm = () => {
    setFormVisibility(true);
  };

  const closeForm = () => {
    setFormVisibility(false);
    setDataToEdit(null);
  };

  const handleCardClick = (row: number) => {
    setDataToEdit(activeVehicleData.insurance_data.find((data) => data.row === row));
    openForm();
  };

  const handleFormSubmit = async (task: string, user_id: string, formData: InsuranceData) => {
    const supabase = createClient();
    if (task === "add") {
      try {
        const { data, error } = await supabase.rpc("add_insurance_data", {
          data: { ...formData, vehicle_row: activeVehicleData.row, user_id: user_id },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (updatedVehicleData.insurance_data) {
              updatedVehicleData.insurance_data.push({
                ...formData,
                row: data.row,
              });
            } else {
              updatedVehicleData.insurance_data = [
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
        const { data, error } = await supabase.rpc("update_insurance_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (updatedVehicleData.insurance_data) {
              const indexToUpdate = updatedVehicleData.insurance_data.findIndex((data) => data.row === data.row);
              if (indexToUpdate != null) {
                updatedVehicleData.insurance_data[indexToUpdate] = formData;
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
        const { data, error } = await supabase.rpc("delete_insurance_data", {
          data: { ...formData, user_id: user_id, vehicle_row: activeVehicleData.row },
        });
        if (!error) {
          if (data != null) {
            const updatedVehicleData: VehicleData = JSON.parse(JSON.stringify(activeVehicleData));
            if (updatedVehicleData.insurance_data) {
              const indexToDelete = updatedVehicleData.insurance_data.findIndex((data) => data.row === data.row);
              if (indexToDelete != null) {
                updatedVehicleData.insurance_data.splice(indexToDelete, 1);
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
          <DataInputButton name={"insurance data"} clickAction={openForm}></DataInputButton>
        </div>
      )}
      <div className="card-container">
        <InsuranceDataForm
          open={formVisibility}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          existingFormData={dataToEdit}
        ></InsuranceDataForm>
        {InsuranceOverviewCard(activeVehicleData)}
        {activeVehicleData?.insurance_data && (
          <>
            {activeVehicleData.insurance_data.map((data, index) =>
              DataCard(index + 1, "Insurance data", data, INSURANCE_INFO_PRINTED, handleCardClick)
            )}
          </>
        )}
      </div>
    </div>
  );
}
