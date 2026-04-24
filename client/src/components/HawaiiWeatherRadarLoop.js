import React, { useEffect, useState } from "react";
import "./ImageLoop.css";

const HawaiiWeatherRadarLoop = ({ id }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch(`/api/hawaii-weather-radar-loop/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.image) {
          setImage(`data:image/gif;base64,${data.image}`);
        }
      });
  }, [id]);

  return (
    <div className="radar-loop">
      {image ? (
        <img
          src={image}
          alt={`Hawaii radar loop (${id})`}
          className="radar-loop-image"
        />
      ) : (
        <p className="radar-loop-loading">Loading image...</p>
      )}
    </div>
  );
};

export default HawaiiWeatherRadarLoop;
