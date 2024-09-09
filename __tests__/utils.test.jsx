import { capitalizeFirstLetter } from "@/app/_components/Utils";
import "@testing-library/jest-dom";

test("Correct capitalization of the 1st letter", () => {
  expect(capitalizeFirstLetter("test")).toBe("Test");
  expect(capitalizeFirstLetter("TEST")).toBe("Test");
  expect(capitalizeFirstLetter("tEST")).toBe("Test");
});
