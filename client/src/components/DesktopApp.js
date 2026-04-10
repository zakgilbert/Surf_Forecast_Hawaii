import { useMemo, useState } from "react";
import { handleGridCall, groupedData } from "../utility.js";
import {
  Segment,
  SegmentGroup,
  Grid,
  Divider,
  GridColumn,
  Button,
  Sidebar,
  Menu,
  SidebarPusher,
  Container,
  List,
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardMeta,
} from "semantic-ui-react";

function DesktopApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [renderData, setRenderData] = useState([]);

  const clearGrid = () => {
    setRenderData([]);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemClick = (item) => {
    setRenderData((prevData) => {
      const alreadyExists = prevData.some((entry) => entry.id === item.id);
      return alreadyExists ? prevData : [...prevData, item];
    });
  };

  const filteredGroupedData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return groupedData;
    }

    const filtered = {};

    Object.keys(groupedData).forEach((tag) => {
      const matches = groupedData[tag].filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const id = String(item.id || "").toLowerCase();
        const header = item.header?.toLowerCase() || "";
        const meta = item.meta?.toLowerCase() || "";

        return (
          name.includes(term) ||
          id.includes(term) ||
          header.includes(term) ||
          meta.includes(term)
        );
      });

      if (matches.length > 0) {
        filtered[tag] = matches;
      }
    });

    return filtered;
  }, [searchTerm]);

  const hasResults = renderData.length > 0;

  return (
    <div className="desktop-app">
      <Container fluid>
        <Sidebar
          as={Menu}
          animation="push"
          icon="labeled"
          inverted
          vertical
          visible
          direction="left"
          className="desktop-app-sidebar"
        >
          <section className="garamond desktop-app-sidebar-section">
            <div className="navy georgia ma0 grow desktop-app-sidebar-title-wrap">
              <h2 className="f2"></h2>
            </div>

            <div className="desktop-app-search-wrap">
              <input
                className="pa3 bb br3 grow b--none bg-lightest-blue ma3 desktop-app-search-input"
                type="search"
                placeholder="Search Buoy"
                value={searchTerm}
                onChange={handleChange}
              />
            </div>

            <div>
              {Object.keys(filteredGroupedData).map((tag) => (
                <div key={tag} className="desktop-app-group">
                  <h3 className="desktop-app-group-title">
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </h3>

                  <List link direction="left" className="desktop-app-list">
                    {filteredGroupedData[tag].map((data) => (
                      <List.Item
                        key={data.id}
                        className="desktop-app-list-item"
                      >
                        <button
                          type="button"
                          onClick={() => handleItemClick(data)}
                          className="desktop-app-list-button"
                        >
                          {data.name}
                        </button>
                      </List.Item>
                    ))}
                  </List>
                </div>
              ))}

              {Object.keys(filteredGroupedData).length === 0 && (
                <div className="desktop-app-empty-search">
                  No buoys match your search.
                </div>
              )}
            </div>
          </section>
        </Sidebar>

        {hasResults && (
          <div className="desktop-app-content-shell">
            <Button
              onClick={clearGrid}
              color="red"
              className="desktop-app-refresh-button"
            >
              Refresh
            </Button>

            <div className="desktop-app-content-wrap">
              <SidebarPusher className="desktop-app-pusher">
                <SegmentGroup className="desktop-app-segment-group">
                  <SegmentGroup
                    horizontal
                    className="desktop-app-segment-group-horizontal"
                  >
                    <Divider />
                    <Segment placeholder className="desktop-app-main-segment">
                      <Grid stackable doubling columns={2}>
                        {renderData.map((item) => (
                          <GridColumn
                            key={item.id}
                            mobile={16}
                            tablet={8}
                            computer={8}
                            textAlign="center"
                          >
                            <Card fluid className="desktop-app-card">
                              <CardContent className="desktop-app-card-content">
                                <CardHeader>{item.header}</CardHeader>
                                <CardMeta>{item.meta}</CardMeta>
                                <CardDescription className="desktop-app-card-description">
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
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default DesktopApp;