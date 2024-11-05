import React, { useState, useEffect, Container } from "react";
import StationInput from "./components/StationInput.js";
import Power from "./components/Power.js";
import PowerGraph from "./components/PowerGraph.js";
import {
  GridRow,
  GridColumn,
  Grid,
  Image,
  Card,
  CardGroup,
  CardContent,
  CardHeader,
  CardDescription,
} from "semantic-ui-react";

function App() {
  const [stationId, setStationId] = useState("");
  const handleChange = (e) => {
    setStationId(e.target.value);
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

  return (
    <div>
      <section className="garamond">
        <div className="navy georgia ma0 grow">
          <h2 className="f2">Search Buoy</h2>
        </div>
        <div className="pa2">
          <input
            className="pa3 bb br3 grow b--none bg-lightest-blue ma3"
            type="search"
            placeholder="Search People"
            onChange={handleChange}
          />
        </div>
        <div>
        <Grid columns={2} divided>
          <GridRow>
            <GridColumn>
              {renderStation()}
            </GridColumn>
            <GridColumn>
              {renderPower()}
            </GridColumn>
          </GridRow>
        </Grid>
        </div>
      </section>
    </div>
  );
}
export default App;
