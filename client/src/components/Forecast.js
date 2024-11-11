import React, { useState, useEffect } from "react";
import { Container, Header, Button, Icon, Menu, Popup, Table, TableCell, Text } from "semantic-ui-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label,
} from "recharts";
import moment from "moment"; // Import moment.js for date formatting

const Forecast = ({ id }) => {
  const [data, setData] = useState({});  // Initialize as an object instead of array

  useEffect(() => {
    fetch(`/forecast/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);  // Set the whole response data as the state
        console.log(data);  // Check the structure of the response
      });
  }, [id]);

  return data.forecast ? (  // Check if forecast is present
    <div style={{ maxHeight: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' ,textAlign: 'left'}}>
      <pre>{data.forecast}</pre>  {/* Display the forecast */}
    </div>
  ) : (
    <></>  // Render nothing if there's no forecast
  );
};

export default Forecast;
