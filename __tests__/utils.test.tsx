import { capitalizeFirstLetter, getCoef } from "@/app/_components/Utils";
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
