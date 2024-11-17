import React, { useState } from 'react';

const BoxShadowGenerator = () => {
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [blurRadius, setBlurRadius] = useState(0);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'horizontalOffset':
        setHorizontalOffset(parseInt(value));
        break;
      case 'verticalOffset':
        setVerticalOffset(parseInt(value));
        break;
      case 'blurRadius':
        setBlurRadius(parseInt(value));
        break;
      case 'spreadRadius':
        setSpreadRadius(parseInt(value));
        break;
      case 'color':
        setColor(value);
        break;
      case 'opacity':
        setOpacity(parseFloat(value));
        break;
      default:
        break;
    }
  };

  const boxShadowStyle = {
    boxShadow: `${horizontalOffset}px ${verticalOffset}px ${blurRadius}px ${spreadRadius}px ${color}`,
    opacity: opacity,
    width: '200px',
    height: '200px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fff',
    display: 'inline-block',
  };

  return (
    <div>
      <h2>CSS Box Shadow Generator</h2>
      <div>
        <label>Horizontal Offset:</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={horizontalOffset}
          name="horizontalOffset"
          onChange={handleInputChange}
        />
        <span>{horizontalOffset}px</span>
      </div>
      <div>
        <label>Vertical Offset:</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={verticalOffset}
          name="verticalOffset"
          onChange={handleInputChange}
        />
        <span>{verticalOffset}px</span>
      </div>
      <div>
        <label>Blur Radius:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={blurRadius}
          name="blurRadius"
          onChange={handleInputChange}
        />
        <span>{blurRadius}px</span>
      </div>
      <div>
        <label>Spread Radius:</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={spreadRadius}
          name="spreadRadius"
          onChange={handleInputChange}
        />
        <span>{spreadRadius}px</span>
      </div>
      <div>
        <label>Color:</label>
        <input
          type="color"
          value={color}
          name="color"
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Opacity:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          name="opacity"
          onChange={handleInputChange}
        />
        <span>{opacity}</span>
      </div>
      <div style={boxShadowStyle} />
    </div>
  );
};

export default BoxShadowGenerator;