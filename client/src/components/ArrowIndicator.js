import React from "react";

const ArrowIndicator = ({ direction }) => {
  // Ensure the direction is between 0 and 360
  const normalizedDirection = direction % 360;
  const oppositeDirection = (direction + 180)%360;
  console.log("Direction received:", normalizedDirection, "Adjusted direction:", oppositeDirection);

  const arrowStyle = {
    display: "inline-block",
    transform: `rotate(${oppositeDirection}deg)`,
    transition: "transform 0.3s ease",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "10px",
      }}
    >
      <div style={arrowStyle}>
        {/* Using an arrow-like character */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L15 8H9L12 2Z" // Arrowhead
            fill="black"
          />
          <path
            d="M11 8V22H13V8H11Z" // Arrow body
            fill="black"
          />
        </svg>
      </div>
    </div>
  );
};

export default ArrowIndicator;
