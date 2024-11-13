import React, { useState } from "react";
import StationInput from "./StationInput.js";
import Power from "./Power.js";
import Tide from "./Tide.js";
import { handleGridCall, groupedData } from "../utility.js";

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

  const clearGrid = () => {
    setRenderData([]);
  };

  const handleChange = (e) => {
    setStationId(e.target.value);
  };
  const handleItemClick = (item) => {
    setRenderData((prevData) => [...prevData, item]);
  };

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
