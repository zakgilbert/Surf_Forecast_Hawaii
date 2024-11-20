import React from "react";
import { XAxis, LineChart, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

const CustomXAxisTick = ({ x, y, payload, index, ticks }) => {
  const isLastTick = index === ticks.length - 1; // Check if it's the last tick
  return (
    <>
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dy={16}
        fill={isLastTick ? "#ff0000" : "#888"} // Highlight last tick in red
      >
        {payload.value}
      </text>
      {isLastTick && (
        <circle cx={x} cy={y} r={5} fill="#ff0000" /> // Optional: Draw a circle at the last tick for emphasis
      )}
      <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#888" />
    </>
  );
};
export default CustomXAxisTick;
