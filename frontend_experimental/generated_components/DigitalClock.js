import React, { useState } from 'react';

const themes = [
  { id: 1, name: 'Light', backgroundColor: '#f0f0f0', color: '#000' },
  { id: 2, name: 'Dark', backgroundColor: '#333', color: '#fff' },
  { id: 3, name: 'Minimalist', backgroundColor: '#fff', color: '#333' },
  { id: 4, name: 'Futuristic', backgroundColor: '#000', color: '#0f0' },
];

const DigitalClock = () => {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [time, setTime] = useState(new Date());

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const updateTime = () => {
    setTime(new Date());
  };

  setInterval(updateTime, 1000);

  return (
    <div className="digital-clock" style={{ backgroundColor: selectedTheme.backgroundColor }}>
      <h2 style={{ color: selectedTheme.color }}>
        {time.toLocaleTimeString()}
      </h2>
      <div className="theme-selector">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`theme-option ${selectedTheme.id === theme.id ? 'selected' : ''}`}
            style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
            onClick={() => handleThemeChange(theme)}
          >
            {theme.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalClock;