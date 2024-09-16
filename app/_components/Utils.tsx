import React from "react";

// Capitalizes first letter
export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Calculates coefficients for short representation (<1000 x 1000^coefficient)
export const getCoef = (value: number) => {
  let coef = 1;
  while (value > 600) {
    // if >500, plot y axis goes to 1000
    value /= 1000;
    coef *= 1000;
  }
  return coef;
};

// Calculates total cost
export const calcTotalCost = (data: VehicleData) => {
  let cost = data.purchase_price ? data.purchase_price : 0;
  cost -= data.sell_price ? data.sell_price : 0;
  if (data.refuel_data) {
    data.refuel_data.forEach((data) => {
      cost += data.cost;
    });
  }
  if (data.insurance_data) {
    data.insurance_data.forEach((data) => {
      cost += data.cost;
    });
  }
  if (data.maintenance_data) {
    data.maintenance_data.forEach((data) => {
      cost += data.cost;
    });
  }
  if (data.ticket_data) {
    data.ticket_data.forEach((data) => {
      cost += data.cost;
    });
  }
  return cost;
};
