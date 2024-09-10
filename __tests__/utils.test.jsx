import { VehiclesOverviewCard } from "@/app/_components/cards/VehiclesOverviewCard";
import { capitalizeFirstLetter, getRowSpan } from "@/app/_components/Utils";
import "@testing-library/jest-dom";

test("Capitalization of the 1st letter", () => {
  expect(capitalizeFirstLetter("test")).toBe("Test");
  expect(capitalizeFirstLetter("TEST")).toBe("TEST");
  expect(capitalizeFirstLetter("tEST")).toBe("TEST");
});

test("Row span calculation for VehicleOverviewCard", () => {
  expect(
    getRowSpan(
      VehiclesOverviewCard([], null),
      2 // For top and bottom 1 line margin each
    )
  ).toBe(5);

  expect(
    getRowSpan(
      VehiclesOverviewCard(
        [
          { type: "car", make: "a", model: "a" },
          { type: "car", make: "b", model: "b" },
          { type: "car", make: "c", model: "c" },
        ],
        null
      ),
      2 // For top and bottom 1 line margin each
    )
  ).toBe(8);

  expect(
    getRowSpan(
      VehiclesOverviewCard(
        [
          { type: "car", make: "a", model: "a", sell_price: 1 },
          { type: "car", make: "b", model: "b" },
          { type: "car", make: "c", model: "c" },
        ],
        null
      ),
      2 // For top and bottom 1 line margin each
    )
  ).toBe(11);

  expect(
    getRowSpan(
      VehiclesOverviewCard(
        [
          { type: "car", make: "a", model: "a", sell_date: "2010-10-10" },
          { type: "car", make: "b", model: "b" },
          { type: "motorcycle", make: "c", model: "c" },
        ],
        null
      ),
      2 // For top and bottom 1 line margin each
    )
  ).toBe(12);

  expect(
    getRowSpan(
      VehiclesOverviewCard(
        [
          { type: "car", make: "a", model: "a" },
          { type: "car", make: "b", model: "b" },
          { type: "motorcycle", make: "c", model: "c" },
        ],
        null
      ),
      2 // For top and bottom 1 line margin each
    )
  ).toBe(9);
});
