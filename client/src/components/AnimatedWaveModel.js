import React, { useState, useEffect } from "react";
import "../App.css";

const AnimatedWaveModel = ({ id, mode }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/wave-model/${id}/${mode}`);
        const data = await response.json();
        if (data.images) {
          setImages(data.images);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching wave model images:", error);
      }
    };

    fetchImages();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, mode, intervalId]);

  const toggleAnimation = () => {
    if (isPlaying) {
      clearInterval(intervalId);
      setIsPlaying(false);
    } else {
      const newIntervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 500);
      setIntervalId(newIntervalId);
      setIsPlaying(true);
    }
  };

  const nextImage = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

  const prevImage = () =>
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);

  return (
    <div className="wave-model-container">
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
          className="wave-model-image"
        />
      )}

      <div className="wave-model-controls">
        <button onClick={prevImage}>Previous</button>
        <button onClick={nextImage}>Next</button>
        <button onClick={toggleAnimation}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default AnimatedWaveModel;