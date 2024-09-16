import { capitalizeFirstLetter, calcTotalCost, getCoef } from "@/app/_components/Utils";
import "@testing-library/jest-dom";
import { expect, test } from "@jest/globals";

test("Capitalization of the 1st letter", () => {
  expect(capitalizeFirstLetter("test")).toBe("Test");
  expect(capitalizeFirstLetter("TEST")).toBe("TEST");
  expect(capitalizeFirstLetter("tEST")).toBe("TEST");
});

test("Short number representation", () => {
  expect(getCoef(0.1)).toStrictEqual(1);
  expect(getCoef(1)).toStrictEqual(1);
  expect(getCoef(10)).toStrictEqual(1);
  expect(getCoef(100)).toStrictEqual(1);
  expect(getCoef(1000)).toStrictEqual(1000);
  expect(getCoef(10000)).toStrictEqual(1000);
  expect(getCoef(100000)).toStrictEqual(1000);
  expect(getCoef(1000000)).toStrictEqual(1000000);
  expect(getCoef(600000)).toStrictEqual(1000);
  expect(getCoef(600001)).toStrictEqual(1000000);
});

test("Total cost calculation", () => {
  expect(
    calcTotalCost({
      purchase_price: 30000,
      row: 0,
      type: "",
      make: "",
      model: "",
      trim: "",
      year: 0,
      color: "",
      plate: "",
      vin: "",
      fuel_type: "",
      purchase_date: "",
      sell_date: "",
      sell_price: 0,
      avg_mileage: 0,
      avg_consumption: 0,
      refuel_data: [],
      odometer_data: [],
      insurance_data: [],
      maintenance_data: [],
      accident_data: [],
      ticket_data: [],
      details: false,
    })
  ).toBe(30000);
  expect(
    calcTotalCost({
      purchase_price: 30000,
      sell_price: 20000,
      row: 0,
      type: "",
      make: "",
      model: "",
      trim: "",
      year: 0,
      color: "",
      plate: "",
      vin: "",
      fuel_type: "",
      purchase_date: "",
      sell_date: "",
      avg_mileage: 0,
      avg_consumption: 0,
      refuel_data: [],
      odometer_data: [],
      insurance_data: [],
      maintenance_data: [],
      accident_data: [],
      ticket_data: [],
      details: false,
    })
  ).toBe(10000);
  expect(
    calcTotalCost({
      purchase_price: 30000,
      sell_price: 20000,
      row: 0,
      type: "",
      make: "",
      model: "",
      trim: "",
      year: 0,
      color: "",
      plate: "",
      vin: "",
      fuel_type: "",
      purchase_date: "",
      sell_date: "",
      avg_mileage: 0,
      avg_consumption: 0,
      refuel_data: [
        {
          cost: 10,
          row: 0,
          date: "",
          amount: 0,
        },
      ],
      odometer_data: [],
      insurance_data: [],
      maintenance_data: [],
      accident_data: [],
      ticket_data: [],
      details: false,
    })
  ).toBe(10010);
  expect(
    calcTotalCost({
      purchase_price: 30000,
      sell_price: 20000,
      row: 0,
      type: "",
      make: "",
      model: "",
      trim: "",
      year: 0,
      color: "",
      plate: "",
      vin: "",
      fuel_type: "",
      purchase_date: "",
      sell_date: "",
      avg_mileage: 0,
      avg_consumption: 0,
      refuel_data: [
        {
          cost: 10,
          row: 0,
          date: "",
          amount: 0,
        },
        {
          cost: 10,
          row: 1,
          date: "",
          amount: 0,
        },
      ],
      odometer_data: [],
      insurance_data: [],
      maintenance_data: [],
      accident_data: [],
      ticket_data: [],
      details: false,
    })
  ).toBe(10020);
  expect(
    calcTotalCost({
      purchase_price: 30000,
      sell_price: 20000,
      row: 0,
      type: "",
      make: "",
      model: "",
      trim: "",
      year: 0,
      color: "",
      plate: "",
      vin: "",
      fuel_type: "",
      purchase_date: "",
      sell_date: "",
      avg_mileage: 0,
      avg_consumption: 0,
      refuel_data: [
        {
          cost: 10,
          row: 0,
          date: "",
          amount: 0,
        },
        {
          cost: 10,
          row: 1,
          date: "",
          amount: 0,
        },
      ],
      odometer_data: [],
      insurance_data: [
        {
          cost: 1000,
          row: 0,
          provider: "",
          start_date: "",
          end_date: "",
        },
      ],
      maintenance_data: [],
      accident_data: [],
      ticket_data: [],
      details: false,
    })
  ).toBe(11020);
  expect(
    calcTotalCost({
      purchase_price: 30000,
      sell_price: 20000,
      row: 0,
      type: "",
      make: "",
      model: "",
      trim: "",
      year: 0,
      color: "",
      plate: "",
      vin: "",
      fuel_type: "",
      purchase_date: "",
      sell_date: "",
      avg_mileage: 0,
      avg_consumption: 0,
      refuel_data: [
        {
          cost: 10,
          row: 0,
          date: "",
          amount: 0,
        },
        {
          cost: 10,
          row: 1,
          date: "",
          amount: 0,
        },
      ],
      odometer_data: [],
      insurance_data: [
        {
          cost: 1000,
          row: 0,
          provider: "",
          start_date: "",
          end_date: "",
        },
      ],
      maintenance_data: [],
      accident_data: [],
      ticket_data: [
        {
          cost: 100,
          row: 0,
          date: "",
          reason: "",
        },
      ],
      details: false,
    })
  ).toBe(11120);
});
