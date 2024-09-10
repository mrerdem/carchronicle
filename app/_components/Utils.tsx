import React from "react";

// Capitalizes first letter
export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Calculates the number of rows a card should span in masonry layout
export const getRowSpan = (element: React.JSX.Element, rowNum: number) => {
  if (!element) return;
  element.props.children;

  if (element.props["row-num"]) {
    rowNum += Number(element.props["row-num"]);
  }

  React.Children.forEach(element.props.children, (child) => {
    if (React.isValidElement(child)) {
      rowNum = getRowSpan(child, rowNum);
    }
  });

  return rowNum;
};
