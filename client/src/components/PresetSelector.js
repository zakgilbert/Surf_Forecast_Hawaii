import React, { useState } from "react";

function PresetSelector({ presets, selectedPreset, onSelectPreset }) {
  const [presetOpen, setPresetOpen] = useState(false);

  return (
    <div className="desktop-app-preset-wrap">
      <div className="desktop-app-preset-container">
        <button
          type="button"
          className="desktop-app-preset-selector"
          onClick={() => setPresetOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={presetOpen}
          aria-label="Surf Forecast Presets"
        >
          <span className="desktop-app-preset-icon">🌊</span>
          <span className="desktop-app-preset-text">{selectedPreset}</span>
          <span className="desktop-app-preset-chevron">▾</span>
        </button>

        {presetOpen && (
          <div className="desktop-app-preset-dropdown" role="listbox">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                className="desktop-app-preset-option"
                onClick={() => {
                  onSelectPreset(preset);
                  setPresetOpen(false);
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PresetSelector;