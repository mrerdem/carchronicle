"use client";
import { VehicleSelector } from "@/app/_components/VehicleSelector";
import { MileageOverviewCard } from "@/app/_components/cards/MileageOverviewCard";
import { ConsumptionOverviewCard } from "@/app/_components/cards/ConsumptionOverviewCard";
import { InsuranceOverviewCard } from "@/app/_components/cards/InsuranceOverviewCard";
import { MaintenanceOverviewCard } from "@/app/_components/cards/MaintenanceOverviewCard";
import { AccidentsOverviewCard } from "@/app/_components/cards/AccidentsOverviewCard";
import { TicketsOverviewCard } from "@/app/_components/cards/TicketsOverviewCard";
import { useAppSelector } from "@/app/_redux/hooks";
import { selectActiveVehicleData } from "@/app/_redux/features/vehicleData/vehicleDataSlice";
import { VehicleOverviewCard } from "../_components/cards/VehicleOverviewCard";

export default function Dashboard() {
  const activeVehicleData = useAppSelector(selectActiveVehicleData);

  return (
    <div className="data-container">
      {activeVehicleData && (
        <div className="options-container">
          <VehicleSelector />
        </div>
      )}
      <div className="card-container">
        {VehicleOverviewCard(activeVehicleData)}
        {ConsumptionOverviewCard(activeVehicleData)}
        {MileageOverviewCard(activeVehicleData)}
        {InsuranceOverviewCard(activeVehicleData)}
        {MaintenanceOverviewCard(activeVehicleData)}
        {TicketsOverviewCard(activeVehicleData)}
        {AccidentsOverviewCard(activeVehicleData)}
      </div>
    </div>
  );
}
