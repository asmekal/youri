import React, { useState } from 'react';

const PixelArtBoard = () => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [pixels, setPixels] = useState(Array(16).fill(null).map(() => Array(16).fill(null)));

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handlePixelClick = (x, y) => {
    const updatedPixels = [...pixels];
    updatedPixels[x][y] = selectedColor;
    setPixels(updatedPixels);
  };

  const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  return (
    <div>
      <h2>Pixel Drawing Board</h2>
      <div style={{ display: 'flex' }}>
        {colors.map((color) => (
          <input
            key={color}
            type="radio"
            name="color"
            value={color}
            checked={color === selectedColor}
            onChange={handleColorChange}
            style={{ accentColor: color }}
          />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)' }}>
        {pixels.map((row, x) => (
          row.map((pixel, y) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: pixel,
                border: '1px solid #ccc',
              }}
              onClick={() => handlePixelClick(x, y)}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default PixelArtBoard;