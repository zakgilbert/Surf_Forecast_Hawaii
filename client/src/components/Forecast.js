import React, { useState, useEffect } from "react";
import { CHART_HEIGHT_STR } from "../constants";


const Forecast = ({ id }) => {
  const [data, setData] = useState({}); // Initialize as an object instead of array

  useEffect(() => {
    fetch(`/forecast/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the whole response data as the state
        console.log(data); // Check the structure of the response
      });
  }, [id]);

  return data.forecast ? ( // Check if forecast is present
    <div
      style={{
        maxHeight: CHART_HEIGHT_STR,
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
        textAlign: "left",
        height: "700px"
      }}
    >
      <pre>{data.forecast}</pre> {/* Display the forecast */}
    </div>
  ) : (
    <></> // Render nothing if there's no forecast
  );
};

export default Forecast;
