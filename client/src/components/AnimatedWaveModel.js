import React, { useState, useEffect } from "react";
import "../App.css"; // Import the CSS file

const AnimatedWaveModel = ({id}) => {
  const [images, setImages] = useState([]); // To store the fetched images
  const [loading, setLoading] = useState(true); // To track loading state
  const [currentIndex, setCurrentIndex] = useState(0); // To track current image index
  const [isPlaying, setIsPlaying] = useState(false); // To track if the animation is playing
  const [intervalId, setIntervalId] = useState(null); // To store the interval ID for controlling animation speed

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/wave-model/${id}`);
        const data = await response.json();
        if (data.images) {
          setImages(data.images);
          setLoading(false); // Mark loading as false once images are fetched
        }
      } catch (error) {
        console.error("Error fetching wave model images:", error);
      }
    };
    fetchImages();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Function to start and pause the animation
  const toggleAnimation = () => {
    if (isPlaying) {
      clearInterval(intervalId);
      setIsPlaying(false);
    } else {
      const id = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 500);
      setIntervalId(id);
      setIsPlaying(true);
    }
  };

  // Go to the next and previous images
  const nextImage = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  const prevImage = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);

  return (
    <div style={{ position: "relative", width: "100%", height: "645px" }}>
      {loading && (
        <div className="loading-container">
          <p className="loading-text">Wave Model Loading...</p>
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        </div>
      )}
      {!loading && images.length > 0 && (
        <img
          src={`data:image/png;base64,${images[currentIndex]}`}
          alt="Wave Model"
          style={{
            position: "absolute",
            top: "0",
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        <button onClick={prevImage}>Previous</button>
        <button onClick={nextImage}>Next</button>
        <button onClick={toggleAnimation}>{isPlaying ? "Pause" : "Play"}</button>
      </div>
    </div>
  );
};

export default AnimatedWaveModel;
