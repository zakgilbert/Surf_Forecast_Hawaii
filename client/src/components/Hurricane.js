import React, { useEffect, useState } from "react";
import "./ImageLoop.css";

const HurricaneImage = ({ id, width, height }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch(`/api/hurricane/${id}/${width}/${height}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.image) {
          setImage(`data:image/gif;base64,${data.image}`);
        }
      })
      .catch(() => setImage(null));
  }, [id, width, height]);

  return (
    <div className="hurricane-image">
      {image ? (
        <img
          src={image}
          alt={`Hurricane rendering (${id})`}
          className="hurricane-image-img"
        />
      ) : (
        <p className="hurricane-image-loading">Loading image...</p>
      )}
    </div>
  );
};

export default HurricaneImage;