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
import PresetSelector from "./PresetSelector";
import { PRESET_DEFINITIONS } from "../presetDefinitions.js";
import { CONTENT_DATA } from "../contentData.js";

function DesktopApp({ sidebarOpen, searchTerm, setSearchTerm }) {
  const [renderData, setRenderData] = useState([]);
  const [columnCount, setColumnCount] = useState(2);
  const [selectedPreset, setSelectedPreset] = useState("Forecast Presets");

  const contentById = useMemo(() => {
  return Object.fromEntries(CONTENT_DATA.map((item) => [item.id, item]));
}, []);

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

const loadPreset = (presetName) => {
  setSelectedPreset(presetName);

  const presetIds = PRESET_DEFINITIONS[presetName] || [];

  const presetItems = presetIds
    .map((id) => contentById[id])
    .filter(Boolean);

  setRenderData(presetItems);
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
    <div
      className={`desktop-app ${
        sidebarOpen ? "desktop-app-sidebar-open" : "desktop-app-sidebar-closed"
      }`}
    >
      <Container fluid>
        <Sidebar
          as={Menu}
          animation="push"
          icon="labeled"
          inverted
          vertical
          visible={sidebarOpen}
          direction="left"
          className="desktop-app-sidebar"
        >
          <section className="garamond desktop-app-sidebar-section">
            <div className="navy georgia ma0 grow desktop-app-sidebar-title-wrap">
              <h2 className="f2"></h2>
            </div>
            <PresetSelector
              presets={Object.keys(PRESET_DEFINITIONS)}
              selectedPreset={selectedPreset}
              onSelectPreset={loadPreset}
            />
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
              <div className="desktop-app-toolbar">
                <div className="desktop-app-column-picker">
                  <span className="desktop-app-column-label">Columns</span>

                  <button
                    type="button"
                    className={`desktop-app-column-button ${
                      columnCount === 1 ? "active" : ""
                    }`}
                    onClick={() => setColumnCount(1)}
                  >
                    1
                  </button>

                  <button
                    type="button"
                    className={`desktop-app-column-button ${
                      columnCount === 2 ? "active" : ""
                    }`}
                    onClick={() => setColumnCount(2)}
                  >
                    2
                  </button>

                  <button
                    type="button"
                    className={`desktop-app-column-button ${
                      columnCount === 3 ? "active" : ""
                    }`}
                    onClick={() => setColumnCount(3)}
                  >
                    3
                  </button>
                </div>
              </div>

              <SidebarPusher className="desktop-app-pusher">
                <SegmentGroup className="desktop-app-segment-group">
                  <SegmentGroup
                    horizontal
                    className="desktop-app-segment-group-horizontal"
                  >
                    <Divider />
                    <Segment placeholder className="desktop-app-main-segment">
                      <Grid stackable doubling columns={columnCount}>
                        {renderData.map((item) => (
                          <GridColumn
                            key={item.id}
                            mobile={16}
                            tablet={8}
                            computer={columnCount === 1 ? 16 : 8}
                            largeScreen={
                              columnCount === 3 ? 5 : columnCount === 2 ? 8 : 16
                            }
                            widescreen={
                              columnCount === 3 ? 5 : columnCount === 2 ? 8 : 16
                            }
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
