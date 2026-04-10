const ArrowIndicator = ({ direction }) => {
  const oppositeDirection = (direction + 180) % 360;

  /*
  const normalizedDirection = direction % 360;
  console.log(
    "Direction received:",
    normalizedDirection,
    "Adjusted direction:",
    oppositeDirection
  );
  */

  return (
    <div className="arrow-container">
      <div
        className="arrow-rotate"
        style={{ "--rotation": `${oppositeDirection}deg` }}
      >
        <svg
          className="arrow-svg"
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L15 8H9L12 2Z" className="arrow-head" />
          <path d="M11 8V22H13V8H11Z" className="arrow-body" />
        </svg>
      </div>
    </div>
  );
};

export default ArrowIndicator;
