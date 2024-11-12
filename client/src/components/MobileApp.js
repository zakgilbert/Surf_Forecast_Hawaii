import React, { useState } from "react";
import StationInput from "./StationInput.js";
import Power from "./Power.js";
import Tide from "./Tide.js";
import Forecast from "./Forecast.js";
import MarineForecast from "./MarineForecast.js";
import AnimatedWaveModel from "./AnimatedWaveModel.js";
import { getTideBeginAndEndDates } from "../utility.js";
import { Sidebar, Menu, List, Container, Button, Segment, Header } from "semantic-ui-react";
import { CONTENT_DATA } from "../constants";

function MobileApp() {
  const [showMenu, setShowMenu] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleItemClick = (option) => {
    setSelectedOption(option);
    setShowMenu(false); 
  };

  const handleReturnToMenu = () => {
    setSelectedOption(null);
    setShowMenu(true); // Show menu again
  };
  const handleGridCall = (item) => {
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
      return <AnimatedWaveModel id={item.station}/>;
    }
    return <></>;
  };


  const groupedData = CONTENT_DATA.reduce((acc, item) => {
    if (!acc[item.tag]) {
      acc[item.tag] = [];
    }
    acc[item.tag].push(item);
    return acc;

  }, {});

  return (
    <Container fluid>
      <Sidebar
        as={Menu}
        animation="push"
        icon="labeled"
        inverted
        vertical
        visible={showMenu}
        direction="left"
      >
        {Object.keys(groupedData).map((category) => (
          <div key={category} style={{ padding: "10px", color: "white" }}>
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <List link>
              {groupedData[category].map((item) => (
                <List.Item key={item.id}>
                  <a onClick={() => handleItemClick(item)}>{item.name}</a>
                </List.Item>
              ))}
            </List>
          </div>
        ))}
      </Sidebar>

      {/* Conditional rendering for selected option content */}
      {!showMenu && selectedOption && (
        <Segment basic>
          <Header as="h2">{selectedOption.header}</Header>
          <p>{selectedOption.meta}</p>
          {handleGridCall(selectedOption)}
          <Button onClick={handleReturnToMenu} color="blue">
            Back to Menu
          </Button>
        </Segment>
      )}
    </Container>
  );
}

export default MobileApp;
