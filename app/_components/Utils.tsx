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
