import React, { useState, useEffect } from "react";

const MarineForecast = ({ id }) => {
  const [data, setData] = useState({}); 

  useEffect(() => {
    fetch(`/marine-forecast`)
      .then((res) => res.json())
      .then((data) => {
        setData(data); 
      });
  }, [id]);

  return data[id] ? ( 
    <div
      style={{
        height: "640px",
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
        textAlign: "left",
      }}
    >
      <pre>{data[id]}</pre>
    </div>
  ) : (
    <></>
  );
};

export default MarineForecast;
