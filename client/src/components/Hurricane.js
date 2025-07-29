import React, { useEffect, useState } from "react";

const HurricaneImage = ({ id, width, height }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch(`/hurricane/${id}/${width}/${height}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.image) {
          setImage(`data:image/gif;base64,${data.image}`);
        }
      });
  }, [id, width, height]);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {image ? (
        <img
          src={image}
          alt={`Hurricane rendering (${id})`}
          style={{
            maxWidth: "100%",
            maxHeight: "600px",
            objectFit: "contain",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default HurricaneImage;
