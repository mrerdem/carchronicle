import { VehiclesOverviewCard } from "@/app/_components/cards/VehiclesOverviewCard";
import "@testing-library/jest-dom";

test("Row span calculation for VehicleOverviewCard", () => {
  expect(VehiclesOverviewCard([], null).props.style["gridRowEnd"]).toBe("span 5");

  expect(
    VehiclesOverviewCard([
      { type: "car", make: "a", model: "a" },
      { type: "car", make: "b", model: "b" },
      { type: "car", make: "c", model: "c" },
    ]).props.style["gridRowEnd"]
  ).toBe("span 8");

  expect(
    VehiclesOverviewCard([
      { type: "car", make: "a", model: "a", sell_price: 1 },
      { type: "car", make: "b", model: "b" },
      { type: "car", make: "c", model: "c" },
    ]).props.style["gridRowEnd"]
  ).toBe("span 11");

  expect(
    VehiclesOverviewCard([
      { type: "car", make: "a", model: "a", sell_date: "2010-10-10" },
      { type: "car", make: "b", model: "b" },
      { type: "motorcycle", make: "c", model: "c" },
    ]).props.style["gridRowEnd"]
  ).toBe("span 12");

  expect(
    VehiclesOverviewCard([
      { type: "car", make: "a", model: "a" },
      { type: "car", make: "b", model: "b" },
      { type: "motorcycle", make: "c", model: "c" },
    ]).props.style["gridRowEnd"]
  ).toBe("span 9");
});
