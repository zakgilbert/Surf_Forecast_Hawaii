import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  Container,
  Button,
  Segment,
  Header,
  Icon,
  List,
  Divider,
  Label,
} from "semantic-ui-react";
import { handleGridCall, groupedData } from "../utility";
import "./MobileApp.css";

function MobileApp() {
  const [mode, setMode] = useState("select");
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollerRef = useRef(null);

  const categories = useMemo(() => Object.keys(groupedData), []);
  const flatItems = useMemo(
    () =>
      categories.flatMap((cat) =>
        (groupedData[cat] || []).map((item) => ({ ...item, _cat: cat })),
      ),
    [categories],
  );

  const isSelected = (id) => selectedItems.some((i) => i.id === id);

  const toggleSelect = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [...prev, item];
    });
  };

  const clearAll = () => setSelectedItems([]);

  const startViewing = () => {
    if (!selectedItems.length) return;
    setMode("view");
    setCurrentIndex(0);

    requestAnimationFrame(() => {
      if (scrollerRef.current) {
        scrollerRef.current.scrollTo({ left: 0, behavior: "auto" });
      }
    });
  };

  const backToSelect = () => {
    setMode("select");
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (mode !== "view") return;
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const w = el.clientWidth || 1;
      const idx = Math.round(el.scrollLeft / w);
      setCurrentIndex(idx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [mode]);

  useEffect(() => {
    if (mode !== "view") return;

    const onKey = (e) => {
      if (!scrollerRef.current) return;

      if (e.key === "ArrowRight") {
        const next = Math.min(currentIndex + 1, selectedItems.length - 1);
        scrollerRef.current.scrollTo({
          left: next * scrollerRef.current.clientWidth,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowLeft") {
        const prev = Math.max(currentIndex - 1, 0);
        scrollerRef.current.scrollTo({
          left: prev * scrollerRef.current.clientWidth,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, currentIndex, selectedItems.length]);

  return (
    <Container fluid className="dashboard-dark mobile-app-container">
      {mode === "select" && (
        <div className="mobile-app-select-wrapper">
          <Segment basic className="mobile-app-header-segment">
            <Header as="h2" className="mobile-app-header-title">
              Select Forecasts
            </Header>
            <p className="mobile-app-header-subtitle">
              Tap to select multiple forecasts. Then press{" "}
              <strong>View Forecasts</strong>.
            </p>
          </Segment>

          <div className="mobile-app-list-container">
            {categories.map((cat) => (
              <Segment key={cat} basic className="mobile-app-category-segment">
                <Header as="h4" className="mobile-app-category-header">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Header>

                <List selection relaxed>
                  {groupedData[cat].map((item) => {
                    const on = isSelected(item.id);

                    return (
                      <List.Item
                        key={item.id}
                        onClick={() => toggleSelect(item)}
                        className="mobile-app-list-item"
                      >
                        <div className="mobile-app-list-item-left">
                          <Icon
                            name={on ? "check circle" : "circle outline"}
                            color={on ? "green" : "grey"}
                          />
                          <div>
                            <div className="mobile-app-item-name">
                              {item.name}
                            </div>
                            {item.meta && (
                              <div className="mobile-app-item-meta">
                                {item.meta}
                              </div>
                            )}
                          </div>
                        </div>

                        {on && (
                          <Label color="blue" size="mini" circular>
                            ✓
                          </Label>
                        )}
                      </List.Item>
                    );
                  })}
                </List>
              </Segment>
            ))}
            <div className="mobile-app-list-spacer" />
          </div>

          <div className="mobile-app-sticky-footer">
            <Button
              fluid
              color="blue"
              disabled={selectedItems.length === 0}
              onClick={startViewing}
            >
              <Icon name="play" />
              View Forecasts{" "}
              {selectedItems.length ? `(${selectedItems.length})` : ""}
            </Button>

            {selectedItems.length > 0 && (
              <Button basic onClick={clearAll}>
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      {mode === "view" && (
        <Segment basic className="mobile-app-view-segment">
          <div className="mobile-app-view-top-bar">
            <Button
              icon
              labelPosition="left"
              color="blue"
              onClick={backToSelect}
              className="mobile-app-back-button"
            >
              <Icon name="arrow left" /> Back
            </Button>

            <div className="mobile-app-page-indicator-wrapper">
              <span className="mobile-app-page-indicator-text">
                {selectedItems.length
                  ? `${currentIndex + 1} / ${selectedItems.length}`
                  : ""}
              </span>
            </div>
          </div>

          <Divider />

          <div ref={scrollerRef} className="mobile-app-carousel-container">
            {selectedItems.map((item) => (
              <div key={item.id} className="mobile-app-carousel-slide">
                <Header as="h2" className="mobile-app-slide-header">
                  {item.header || item.name}
                </Header>
                {item.meta && (
                  <p className="mobile-app-slide-meta">{item.meta}</p>
                )}
                {handleGridCall(item)}
              </div>
            ))}
          </div>

          {selectedItems.length > 1 && (
            <div className="mobile-app-dots-container">
              {selectedItems.map((_, i) => (
                <span
                  key={i}
                  onClick={() => {
                    if (!scrollerRef.current) return;
                    scrollerRef.current.scrollTo({
                      left: i * scrollerRef.current.clientWidth,
                      behavior: "smooth",
                    });
                  }}
                  className={`mobile-app-dot ${
                    i === currentIndex ? "mobile-app-dot-active" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </Segment>
      )}
    </Container>
  );
}

export default MobileApp;
