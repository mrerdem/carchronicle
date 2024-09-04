// Calculates number of grid rows the card will occupy for masonry layout
export function getGridRowNum(
  possibleRows: string[], // List of fields printed in card
  infoObject: // Object whose info to be printed
  VehicleData[] | RefillData[] | InsuranceData[] | RefillData[] | MaintenanceData[] | AccidentData[] | TicketData[],
  graph: boolean // To allocate space for graph (10 rows)
): number {
  const minRows = 4; // 4 for title and vertical padding
  let numRows = minRows;
  infoObject?.length &&
    possibleRows.map((row) => {
      Object.keys(infoObject[infoObject.length - 1]).indexOf(row) != -1 && (numRows += 1);
    });
  if (numRows > minRows) {
    graph && (numRows += 10); // 10 for graph
  } else {
    numRows += 1; // "No data" label
  }
  return numRows;
}
