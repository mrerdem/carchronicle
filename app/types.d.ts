type UserPrefs = {
  currency: string;
  volume: string;
  distance: string;
};

type InsuranceData = {
  row: number;
  provider: string;
  start_date: string;
  end_date: string;
  cost: number;
};

type MaintenanceData = {
  row: number;
  type: string;
  provider: string;
  start_date: string;
  end_date: string;
  work: string;
  cost: number;
};

type AccidentData = {
  row: number;
  date: string;
  info: string;
};

type TicketData = {
  row: number;
  date: string;
  reason: string;
  cost: number;
};

type VehicleData = {
  row: number;
  type: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  color: string;
  plate: string;
  vin: string;
  fuel_type: string; // Petrol / diesel
  purchase_date: string;
  purchase_price: number;
  sell_date: string;
  sell_price: number;
  avg_mileage: number; // Average mileage per unit time
  avg_consumption: number; // Average gas consumption per unit distance
  refuel_data: RefuelData[];
  odometer_data: OdometerData[];
  insurance_data: InsuranceData[];
  maintenance_data: MaintenanceData[];
  accident_data: AccidentData[];
  ticket_data: TicketData[];
  details: boolean; // If vehicle details is fetched or not
};

type VehicleListItem = {
  row: number;
  make: string;
  model: string;
};

type OdometerData = {
  row: number;
  date: string;
  reading: number;
};

type RefuelData = {
  row: number;
  date: string;
  amount: number;
  cost: number;
};
