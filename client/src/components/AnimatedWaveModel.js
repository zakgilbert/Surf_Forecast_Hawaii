import React, { useState, useEffect } from "react";

const AnimatedWaveModel = () => {
  const [images, setImages] = useState([]); // This will hold the array of fetched images
  const [loading, setLoading] = useState(true); // Flag to indicate whether images are still being fetched

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/wave-model');
        const data = await response.json();

        if (data.images) {
          // Add images one by one to the images array to create animation
          for (let i = 0; i < data.images.length; i++) {
            const imageBase64 = data.images[i];

            // Check if this image is already in the array (deduplication)
            if (!images.includes(imageBase64)) {
              // Use a small delay between adding images to simulate animation
              setTimeout(() => {
                setImages((prevImages) => [...prevImages, imageBase64]);
              }, i * 500); // Adjust the delay to control the speed of the animation
            }
          }
          setLoading(false); // Mark the loading as finished after the loop
        }
      } catch (error) {
        console.error("Error fetching wave model images:", error);
      }
    };

    fetchImages(); // Start fetching images when the component mounts
  }, [images]); // Re-run the effect if 'images' changes (to handle deduplication)

  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      {loading && <p>Loading images...</p>} {/* Optionally show a loading message */}
      {images.length > 0 && (
        <img
          src={`data:image/png;base64,${images[images.length - 1]}`}
          alt="Wave Model"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
};

export default AnimatedWaveModel;

