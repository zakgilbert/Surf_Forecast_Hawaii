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
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "semantic-ui-react";

function App() {
  const [stationId, setStationId] = useState("");
  const [renderData, setRenderData] = useState([])

  const contentData = [
    { name: "North West", station: "51101", id: 0, tag: "buoy" },
    { name: "Hanalei", station: "51208", id: 1, tag: "buoy" },
    {name:"Hanalei", station: "1611683", id: 2, tag: "tide"},
    { name: "North West", station: "51101", id: 3, tag: "power" },
    { name: "Hanalei", station: "51208", id: 4, tag: "power" }
  ];

  const handleGridCall = (item) => {
    console.log("in handle grid call")
    console.log(item.station)
    if(item.tag === "buoy") {
      return <StationInput id={item.station}  />;
    }
    if(item.tag === "power") {
      return <Power id={item.station}/>;
    }
    if(item.tag === "tide") {
      return <Tide id={item.station} beginDate={20241106} endDate={20241108} timeZone={'LST'}/>;
    }
    return <></>;
  };

  const handleChange = (e) => {
    setStationId(e.target.value);
  };
  const handleItemClick = (item) => {
    setRenderData((prevData) =>[...prevData, item])
  };
  function renderStation() {
    console.log("in renderStation")
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
                <ListItem key={data.id} onClick={() => handleItemClick(data)}>
                  {data.name}
                </ListItem>
              ))}
            </List>
          </section>
        </Sidebar>
        <SidebarPusher >
          <SegmentGroup>
            <Segment>Top</Segment>
            <SegmentGroup horizontal>
              <Segment placeholder fluid>
                <Grid container stackable columns={2}>
                  {renderData.map((item) => (
                    <GridColumn key={item.id}>
                      <Card fluid>
                        <CardContent>
                        <CardHeader>
                          {item.station}
                        </CardHeader>
                        <CardDescription>
                          {handleGridCall(item)}
                        </CardDescription>
                        </CardContent>
                      </Card>
                    </GridColumn>
                  ))}
                </Grid>
              </Segment>
            </SegmentGroup>
            <Segment>Bottom</Segment>
          </SegmentGroup>
        </SidebarPusher>
      </Container>
    </div>
  );
}
export default App;
