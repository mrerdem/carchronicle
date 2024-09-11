import { capitalizeFirstLetter } from "@/app/_components/Utils";
import "@testing-library/jest-dom";
import { expect, test } from "@jest/globals";

test("Capitalization of the 1st letter", () => {
  expect(capitalizeFirstLetter("test")).toBe("Test");
  expect(capitalizeFirstLetter("TEST")).toBe("TEST");
  expect(capitalizeFirstLetter("tEST")).toBe("TEST");
});
