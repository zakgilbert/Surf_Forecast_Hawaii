// Content.js
import React from 'react';

function MobileContent({ option, onBack }) {
  return (
    <div className="mobile-content">
      <h1>{option}</h1>
      <p>Here is the content for {option}.</p>
      {/* Display graphics or additional details here */}
      <button className="back-button" onClick={onBack}>Back to Menu</button>
    </div>
  );
}

export default MobileContent;
