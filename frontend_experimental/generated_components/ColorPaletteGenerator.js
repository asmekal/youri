import React, { useState } from 'react';

const ColorPaletteGenerator = () => {
  const [colorCode, setColorCode] = useState('');
  const [generatedColors, setGeneratedColors] = useState([]);

  const handleGenerate = () => {
    const colors = [];
    for (let i = 0; i < 5; i++) {
      const hue = parseInt(colorCode.substring(1, 3), 16) + (i * 20);
      const saturation = parseInt(colorCode.substring(3, 5), 16);
      const lightness = parseInt(colorCode.substring(5, 7), 16);
      const generatedColor = `#${hue.toString(16).padStart(2, '0')}${saturation.toString(16).padStart(2, '0')}${lightness.toString(16).padStart(2, '0')}`;
      colors.push(generatedColor);
    }
    setGeneratedColors(colors);
  };

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color).then(() => alert('Copied to clipboard'));
  };

  return (
    <div>
      <h2>Color Palette</h2>
      <input type="text" value={colorCode} onChange={(e) => setColorCode(e.target.value)} placeholder="Enter HEX color code" />
      <button onClick={handleGenerate}>Generate</button>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {generatedColors.map((color, index) => (
          <div key={index} style={{ backgroundColor: color, width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: '#fff' }}>{color}</p>
            <button style={{ fontSize: '10px' }} onClick={() => handleCopy(color)}>Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteGenerator;