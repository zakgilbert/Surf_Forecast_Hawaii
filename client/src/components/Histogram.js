import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const Histogram = () => {
  const [data, setData] = useState(null); // Store the fetched data
  useEffect(() => {
    fetch(`/histogram`)
      .then((res) => res.json())
      .then((data) => {
        setData(data); // Set the whole response data as the state
        console.log(data); // Check the structure of the response
      });
  }, []);

  return data ? ( // Check if forecast is present
    <div>
      <h1>Wave Histogram</h1>
      {/* Bar chart for crest-to-trough calculated heights */}
      <h2>Crest-to-Trough Heights</h2>
      <BarChart
        width={800}
        height={400}
        data={data.waves}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="start_time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="wave_height_ft" fill="#8884d8" name="Wave Height (ft)" />
      </BarChart>

      {/* Bar chart for original heights */}
      <h2>Original Heights</h2>
      <BarChart
        width={800}
        height={400}
        data={data.allData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="height" fill="#82ca9d" name="Original Height (ft)" />
      </BarChart>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Histogram;
