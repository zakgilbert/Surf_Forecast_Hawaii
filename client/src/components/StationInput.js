import React, { useState, useEffect } from "react";
import {
  Divider,
  Grid,
  GridColumn,
  GridRow,
  Icon,
  Label,
  Menu,
  Popup,
  Segment,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableC,
} from "semantic-ui-react";
import { CHART_HEIGHT_STR } from "../constants";
import WaveEnergy from "./WaveEnergy";

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
    <div style={{ maxHeight: CHART_HEIGHT_STR }}>
      <Grid container stackable columns={2} divided>
        <GridRow>
          <GridColumn width={5}>
            <Segment>
              <Table celled striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell
                      colSpan="2"
                      textAlign="center"
                      style={{
                        fontSize: "1.2em",
                        fontWeight: "bold",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      {formatDate(data.rows[0][0])}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {data.cols.slice(1, 7).map((col, index) => (
                    <Table.Row key={index}>
                      <Table.Cell
                        style={{
                          padding: "5px",
                          fontWeight: "bold",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        {col.toolTip}:
                      </Table.Cell>
                      <Table.Cell style={{ padding: "5px" }}>
                        {data.rows[0][index + 1]}
                      </Table.Cell>
                    </Table.Row>
                  ))}

                  {/* Special row for index 10 */}
                  <Table.Row key="index-10">
                    <Table.Cell
                      style={{
                        padding: "5px",
                        fontWeight: "bold",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      {data.cols[10].toolTip}:
                    </Table.Cell>
                    <Table.Cell style={{ padding: "5px" }}>
                      {data.rows[0][10]}&deg;
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          </GridColumn>
          <GridColumn width={11}>
            <Segment>
              <WaveEnergy id={id} />
            </Segment>
          </GridColumn>
        </GridRow>
      </Grid>
      <Divider></Divider>
      <div style={{ height: "200px", overflowY: "auto" }}>
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
                    {data.cols[colIndex].value === "Time"
                      ? formatDate(val)
                      : val}
                  </TableCell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default StationInput;
