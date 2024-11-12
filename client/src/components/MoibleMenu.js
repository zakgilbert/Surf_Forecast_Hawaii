// Menu.js
import React from 'react';

function MobileMenu({ onSelect }) {
  const options = ['Option 1', 'Option 2', 'Option 3']; // Replace with your options

  return (
    <div className="mobile-menu">
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={() => onSelect(option)}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MobileMenu;
