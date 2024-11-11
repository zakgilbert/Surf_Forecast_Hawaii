import React, { useState, useEffect } from "react";
import StationInput from "./components/StationInput.js";
import Power from "./components/Power.js";
import Tide from "./components/Tide.js";
import Forecast from "./components/Forecast.js";
import MarineForecast from "./components/MarineForecast.js";
import AnimatedWaveModel from "./components/AnimatedWaveModel.js";
import { CONTENT_DATA } from "./constants.js";
import { getTideBeginAndEndDates } from "./utility.js";

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
  SidebarPusher,
  Container,
  List,
  ListItem,
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardMeta,
} from "semantic-ui-react";

function App() {
  const [stationId, setStationId] = useState("");
  const [renderData, setRenderData] = useState([]);

  const handleGridCall = (item) => {
    console.log("in handle grid call");
    console.log(item.station);
    if (item.tag === "buoy") {
      return <StationInput id={item.station} />;
    }
    if (item.tag === "power") {
      return <Power id={item.station} />;
    }
    if (item.tag === "tide") {
      const beginAndEndDates = getTideBeginAndEndDates();
      return (
        <Tide
          id={item.station}
          beginDate={beginAndEndDates.beginDate}
          endDate={beginAndEndDates.endDate}
          timeZone={"LST"}
        />
      );
    }
    if (item.tag === "forecast") {
      return <Forecast id={item.station} />;
    }
    if (item.tag === "marine-forecast") {
      return <MarineForecast id={item.station} />;
    }
    if (item.tag === "wave-model") {
      return <AnimatedWaveModel/>;
    }
    return <></>;
  };

  const clearGrid = () => {
    setRenderData([]);
  };

  const handleChange = (e) => {
    setStationId(e.target.value);
  };
  const handleItemClick = (item) => {
    setRenderData((prevData) => [...prevData, item]);
  };
  function renderStation() {
    console.log("in renderStation");
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
  const groupedData = CONTENT_DATA.reduce((acc, item) => {
    if (!acc[item.tag]) {
      acc[item.tag] = [];
    }
    acc[item.tag].push(item);
    return acc;
  }, {});
  return (
    <div>
      <Container fluid>
        <Sidebar
          as={Menu}
          animation="push"
          icon="labeled"
          inverted
          vertical
          visible
          direction="left"
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
            <div>
              {Object.keys(groupedData).map((tag) => (
                <div
                  key={tag}
                  style={{
                    textAlign: "left",
                    color: "white",
                    marginTop: "20px",
                    marginBottom: "5px",
                    marginLeft: "10px",
                  }}
                >
                  <h3>{tag.charAt(0).toUpperCase() + tag.slice(1)}</h3>
                  <List link direction="left">
                    {groupedData[tag].map((data) => (
                      <List.Item key={data.id}>
                        <a
                          onClick={() => handleItemClick(data)}
                          style={{ display: "block", textAlign: "left" }}
                        >
                          {data.name}
                        </a>
                      </List.Item>
                    ))}
                  </List>
                </div>
              ))}
            </div>
          </section>
        </Sidebar>

        {/* Conditional rendering for the Refresh button and grid */}
        {renderData.length > 0 && (
          <div>
            <Button
              onClick={clearGrid}
              color="red"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 1,
              }}
            >
              Refresh
            </Button>
            <Container style={{ width: "80%" }}>
              <SidebarPusher fluid>
                <SegmentGroup fluid container>
                  <SegmentGroup horizontal fluid>
                    <Divider></Divider>
                    <Segment placeholder fluid>
                      <Grid stackable columns={2}>
                        {renderData.map((item) => (
                          <GridColumn key={item.id} textAlign="center" fluid>
                            <Card fluid>
                              <CardContent fluid>
                                <CardHeader>{item.header}</CardHeader>
                                <CardMeta>{item.meta}</CardMeta>
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
                </SegmentGroup>
              </SidebarPusher>
            </Container>
          </div>
        )}
      </Container>
    </div>
  );
}
export default App;
