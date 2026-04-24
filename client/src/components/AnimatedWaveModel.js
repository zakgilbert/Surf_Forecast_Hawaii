import React, { useEffect, useState } from "react";
import "./AnimatedWaveModel.css";

const AnimatedWaveModel = ({ id, mode }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/wave-model/${id}/${mode}`);
        const data = await response.json();

        if (!isMounted) return;

        if (Array.isArray(data.images)) {
          setImages(data.images);
          setCurrentIndex(0);
        } else {
          setImages([]);
        }
      } catch (error) {
        console.error("Error fetching wave model images:", error);
        if (isMounted) {
          setImages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsPlaying(false);
        }
      }
    };

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [id, mode]);

  useEffect(() => {
    if (!isPlaying || images.length === 0) return undefined;

    const timerId = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 500);

    return () => window.clearInterval(timerId);
  }, [isPlaying, images]);

  const toggleAnimation = () => {
    if (images.length === 0) return;
    setIsPlaying((prev) => !prev);
  };

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <div className="wave-model-container">
      {loading && (
        <div className="wave-model-loading-container">
          <p className="wave-model-loading-text">Wave Model Loading...</p>
          <div className="wave-model-spinner">
            <div className="wave-model-double-bounce1"></div>
            <div className="wave-model-double-bounce2"></div>
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

      {!loading && images.length === 0 && (
        <div className="wave-model-loading-container">
          <p className="wave-model-loading-text">No wave model images found.</p>
        </div>
      )}

      <div className="wave-model-controls">
        <button type="button" onClick={prevImage}>
          Previous
        </button>
        <button type="button" onClick={nextImage}>
          Next
        </button>
        <button type="button" onClick={toggleAnimation}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default AnimatedWaveModel;