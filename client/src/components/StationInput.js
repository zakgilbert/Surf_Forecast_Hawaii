import React, { useState, useEffect } from "react";
import { Icon, Label, Menu, Popup, Table, TableCell } from "semantic-ui-react";

const StationInput = ({ id }) => {
  const [data, setData] = useState([{}]);

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString("en-US", {
      month: "short", // MMM
      day: "numeric", // D
      hour: "numeric", // h
      minute: "numeric", // mm
      hour12: true, // A (AM/PM)
    });
  };
  useEffect(() => {
    fetch(`/report/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, [id]);

  return data.cols !== undefined && data.rows !== undefined ? (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {" "}
      {/* Adjust height as needed */}
      <Table celled>
        <Table.Header>
          <Table.Row>
            {data.cols.map((col) => (
              <Popup
                trigger={
                  <Table.HeaderCell key={col}>{col.value}</Table.HeaderCell>
                }
              >
                {col.toolTip}
              </Popup>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.rows.map((row, rowIndex) => (
            <Table.Row key={rowIndex}>
              {row.map((val, colIndex) => (
                <TableCell key={colIndex} style={{ padding: "5px" }}>
                  {data.cols[colIndex].value === "Time" ? formatDate(val) : val}
                </TableCell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ) : (
    <></>
  );
};
export default StationInput;
