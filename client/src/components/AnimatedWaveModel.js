import React, { useState, useEffect } from "react";

const AnimatedWaveModel = () => {
  const [images, setImages] = useState([]); // To store the fetched images
  const [loading, setLoading] = useState(true); // To track loading state
  const [currentIndex, setCurrentIndex] = useState(0); // To track current image index
  const [isPlaying, setIsPlaying] = useState(false); // To track if the animation is playing
  const [intervalId, setIntervalId] = useState(null); // To store the interval ID for controlling animation speed

  useEffect(() => {
    // Fetch images once when the component mounts
    const fetchImages = async () => {
      try {
        const response = await fetch("/wave-model");
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

    // Cleanup function to reset state when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clear the interval when the component is unmounted
      }
    };
  }, []);

  // Function to start the animation
  const startAnimation = () => {
    const id = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loop through images
    }, 500); // Adjust the delay to control the speed of the animation
    setIntervalId(id);
    setIsPlaying(true);
  };

  // Function to pause the animation
  const pauseAnimation = () => {
    clearInterval(intervalId); // Clear the interval
    setIsPlaying(false);
  };

  // Function to go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    if (isPlaying && images.length > 0) {
      startAnimation(); // Start animation when the component mounts and if it's playing
    }

    // Clean up and stop the animation when it is paused
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, images.length]); // Restart animation whenever `isPlaying` changes

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "440px",
      }}
    >
      {loading && <p>Loading images...</p>}{" "}
      {/* Show a loading message while images are loading */}
      {images.length > 0 && (
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
      {/* Controls */}
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        <button onClick={prevImage}>Previous</button>
        <button onClick={nextImage}>Next</button>
        <button onClick={isPlaying ? pauseAnimation : startAnimation}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default AnimatedWaveModel;
