import React, { useState } from "react";
import {
  Sidebar,
  Menu,
  List,
  Container,
  Button,
  Segment,
  Header,
} from "semantic-ui-react";
import { handleGridCall, groupedData } from "../utility";

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

  return (
    <Container fluid>
      <Sidebar
        as={Menu}
        animation="push"
        icon="labeled"
        inverted
        vertical
        visible={showMenu}
        direction="right"
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
        <Segment basic fluid>
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
