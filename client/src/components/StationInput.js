import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  GridRow,
  Segment,
  Table,
  TableRow,
  TableCell,
  Popup,
  Header,
  Divider,
} from "semantic-ui-react";
import SwipeableViews from "react-swipeable-views";
import { isMobile } from "react-device-detect";
import WaveEnergy from "./WaveEnergy";
import ArrowIndicator from "./ArrowIndicator";
import BuoyTabs from "./BuoyTabs";
import { formatDate } from "../utility";

const StationInput = ({ id }) => {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch(`/report/${id}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [id]);

  if (!data.cols || !data.rows) return null;

  const summary = (
    <Segment>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2" textAlign="center">
              {formatDate(data.rows[0][0])}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.cols.slice(1, 7).map((col, index) => (
            <Table.Row key={index}>
              <Table.Cell style={{ fontWeight: "bold" }}>{col.toolTip}:</Table.Cell>
              <Table.Cell>{data.rows[0][index + 1]}</Table.Cell>
            </Table.Row>
          ))}
          <Table.Row key="index-10">
            <Table.Cell style={{ fontWeight: "bold" }}>{data.cols[10].toolTip}:</Table.Cell>
            <Table.Cell>
              <Popup
                content={<ArrowIndicator direction={Number(data.rows[0][10])} />}
                trigger={<span>{data.rows[0][10]}&deg;</span>}
                position="top center"
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Segment>
  );

  const chart = (
    <Segment>
      <WaveEnergy id={id} />
    </Segment>
  );

  const tabs = (
    <Segment style={{ padding: "0.5rem", overflowY: "auto", maxHeight: "600px" }}>
      <BuoyTabs data={data} />
    </Segment>
  );

  if (isMobile) {
    return (
      <SwipeableViews enableMouseEvents>
        <div>{summary}</div>
        <div>{chart}</div>
        <div>{tabs}</div>
      </SwipeableViews>
    );
  } else {
    return (
      <div style={{ maxHeight: "850px" }}>
        <Grid container stackable columns={2} divided>
          <GridRow>
            <GridColumn width={5}>{summary}</GridColumn>
            <GridColumn width={11}>{chart}</GridColumn>
          </GridRow>
        </Grid>
        <Divider />
        <Grid>
          <Grid.Row>
            <Grid.Column
              width={16}
              style={{ maxHeight: "260px", overflowY: "auto" }}
            >
              {tabs}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
};

export default StationInput;
