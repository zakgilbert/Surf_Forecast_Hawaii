import React, { useState, useEffectntainer } from "react";
import StationInput from "./components/StationInput.js";
import Power from "./components/Power.js";
import PowerGraph from "./components/PowerGraph.js";
import Tide from "./components/Tide.js";

import {
  Segment,
  SegmentGroup,
  Grid,
  Divider,
  GridColumn,
  GridRow,
  Header,
  Icon,
  Search,
  Button,
  Sidebar,
  Menu,
  Link,
  SidebarPusher,
  Container,
  List,
  ListItem,
} from "semantic-ui-react";

function App() {
  const [stationId, setStationId, currentContent, setCurrentContent] =
    useState("");
  const contentData = [
    { name: "North West", station: "51101", id: 0 },
    { name: "Hanalei", station: "51208", id: 1 },
  ];
  let render_data = [];
  const handleChange = (e) => {
    setStationId(e.target.value);
  };
  const handleItemClick = (item) => {
    console.log(`You clicked on ${item.name}`);
    contentData.push(item.station)
    // Perform any action here (navigate, update state, etc.)
  };
  function renderStation() {
    if (stationId.length === 5) {
      return <StationInput id={stationId} />;
    }
    return <></>;
  }
  function renderPower() {
    if (stationId.length === 5) {
      return <Power id={stationId} />;
    }
    return <></>;
  }

  function renderTide() {
    if (stationId.length === 5) {
      return <Tide id={stationId} />;
    }
    return <></>;
  }
  function renderForecast() {}

  return (
    <div>
      <Container>
        <Sidebar
          as={Menu}
          animation="push"
          icon="labeled"
          inverted
          vertical
          visible
          width="wide"
        >
          <section className="garamond">
            <div className="navy georgia ma0 grow">
              <h2 className="f2"></h2>
            </div>
            <div className="pa2">
              <input
                className="pa3 bb br3 grow b--none bg-lightest-blue ma3"
                type="search"
                placeholder="Search Buoy"
                onChange={handleChange}
              />
            </div>
            <List link>
              {contentData.map((data) => (
                <ListItem key={data.id} onClick={()=> handleItemClick(data)}>
                  {data.name}
                </ListItem>
              ))}
            </List>
          </section>
        </Sidebar>
        <SidebarPusher>
          <SegmentGroup>
            <Segment>Top</Segment>
            <SegmentGroup horizontal>
              <Segment placeholder>
                <Grid columns={2} stackable textAlign="center">
                  <Divider vertical></Divider>
                  <GridRow verticalAlign="middle">
                    <GridColumn>{renderTide()}</GridColumn>
                    <GridColumn>{renderPower()}</GridColumn>
                  </GridRow>
                </Grid>
              </Segment>
            </SegmentGroup>
            <SegmentGroup>
              <Segment>{renderStation()}</Segment>
            </SegmentGroup>
            <Segment>Bottom</Segment>
          </SegmentGroup>
        </SidebarPusher>
      </Container>
    </div>
  );
}
export default App;
