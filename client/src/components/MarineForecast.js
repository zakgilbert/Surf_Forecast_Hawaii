
import React, { useState, useEffect } from "react";

const MarineForecast = ({ id }) => {
  const [data, setData] = useState({}); // Initialize as an object instead of array

  useEffect(() => {
    fetch(`/marine-forecast`)
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the whole response data as the state
        console.log(data); // Check the structure of the response
      });
  }, [id]);

  return data[id] ? ( // Check if forecast is present
    <div
      style={{
        maxHeight: "400px",
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
        textAlign: "left",
      }}
    >
      <pre>{data[id]}</pre> {/* Display the forecast */}
    </div>
  ) : (
    <></> // Render nothing if there's no forecast
  );
};

export default MarineForecast;