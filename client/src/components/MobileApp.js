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

function MobileApp() {
  const [mode, setMode] = useState("select"); // "select" | "view"
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollerRef = useRef(null);

  const categories = useMemo(() => Object.keys(groupedData), []);
  const flatItems = useMemo(
    () =>
      categories.flatMap((cat) =>
        (groupedData[cat] || []).map((item) => ({ ...item, _cat: cat }))
      ),
    [categories]
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
      if (scrollerRef.current) scrollerRef.current.scrollTo({ left: 0, behavior: "instant" });
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
    <Container fluid style={styles.container}>
      {mode === "select" && (
        <div style={styles.selectWrapper}>
          <Segment basic style={styles.headerSegment}>
            <Header as="h2" style={styles.headerTitle}>
              Select Forecasts
            </Header>
            <p style={styles.headerSubtitle}>
              Tap to select multiple forecasts. Then press{" "}
              <strong>View Forecasts</strong>.
            </p>
          </Segment>

          <div style={styles.listContainer}>
            {categories.map((cat) => (
              <Segment key={cat} basic style={styles.categorySegment}>
                <Header as="h4" style={styles.categoryHeader}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Header>
                <List selection relaxed>
                  {groupedData[cat].map((item) => {
                    const on = isSelected(item.id);
                    return (
                      <List.Item
                        key={item.id}
                        onClick={() => toggleSelect(item)}
                        style={styles.listItem}
                      >
                        <div style={styles.listItemLeft}>
                          <Icon
                            name={on ? "check circle" : "circle outline"}
                            color={on ? "green" : "grey"}
                          />
                          <div>
                            <div style={styles.itemName}>{item.name}</div>
                            {item.meta && (
                              <div style={styles.itemMeta}>{item.meta}</div>
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
            <div style={styles.listSpacer} />
          </div>

          <div style={styles.stickyFooter}>
            <Button
              fluid
              color="blue"
              disabled={selectedItems.length === 0}
              onClick={startViewing}
            >
              <Icon name="play" />
              View Forecasts {selectedItems.length ? `(${selectedItems.length})` : ""}
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
        <Segment basic style={styles.viewSegment}>
          <div style={styles.viewTopBar}>
            <Button
              icon
              labelPosition="left"
              color="blue"
              onClick={backToSelect}
              style={styles.backButton}
            >
              <Icon name="arrow left" /> Back
            </Button>
            <div style={styles.pageIndicatorWrapper}>
              <span style={styles.pageIndicatorText}>
                {selectedItems.length ? `${currentIndex + 1} / ${selectedItems.length}` : ""}
              </span>
            </div>
          </div>

          <Divider />

          <div ref={scrollerRef} style={styles.carouselContainer}>
            {selectedItems.map((item) => (
              <div key={item.id} style={styles.carouselSlide}>
                <Header as="h2" style={styles.slideHeader}>
                  {item.header || item.name}
                </Header>
                {item.meta && <p style={styles.slideMeta}>{item.meta}</p>}
                {handleGridCall(item)}
              </div>
            ))}
          </div>

          {selectedItems.length > 1 && (
            <div style={styles.dotsContainer}>
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
                  style={{
                    ...styles.dot,
                    background:
                      i === currentIndex ? "#2185d0" : "rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>
          )}
        </Segment>
      )}
    </Container>
  );
}

/* ---------------- Styles ---------------- */
const styles = {
  container: { padding: 0, minHeight: "100vh" },
  selectWrapper: { display: "flex", flexDirection: "column", minHeight: "100vh" },
  headerSegment: { padding: "1rem 1rem 0.5rem" },
  headerTitle: { marginBottom: 0 },
  headerSubtitle: { marginTop: 6, opacity: 0.8 },
  listContainer: { flex: 1, overflow: "auto" },
  categorySegment: { padding: "0.5rem 1rem" },
  categoryHeader: { marginTop: 0 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    touchAction: "manipulation",
  },
  listItemLeft: { display: "flex", alignItems: "center", gap: 10 },
  itemName: { fontWeight: 600 },
  itemMeta: { fontSize: 12, opacity: 0.7, marginTop: 2 },
  listSpacer: { height: 80 },
  stickyFooter: {
    position: "sticky",
    bottom: 0,
    width: "100%",
    background: "rgba(255,255,255,0.96)",
    borderTop: "1px solid rgba(0,0,0,0.08)",
    backdropFilter: "saturate(180%) blur(8px)",
    padding: "10px",
    display: "flex",
    gap: 10,
  },
  viewSegment: { paddingTop: "1rem" },
  viewTopBar: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  backButton: { marginBottom: "0.5rem" },
  pageIndicatorWrapper: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 },
  pageIndicatorText: { opacity: 0.8 },
  carouselContainer: {
    width: "100%",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    display: "flex",
    gap: 12,
    overscrollBehaviorX: "contain",
  },
  carouselSlide: { scrollSnapAlign: "start", flex: "0 0 100%", maxWidth: "100%" },
  slideHeader: { marginBottom: 0 },
  slideMeta: { marginTop: 6, opacity: 0.8 },
  dotsContainer: { display: "flex", justifyContent: "center", gap: 8, marginTop: 14 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    display: "inline-block",
    cursor: "pointer",
  },
};

export default MobileApp;
