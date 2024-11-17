import React, { useState } from 'react';

const PhotoEditor = () => {
  const [image, setImage] = useState(null);
  const [filter, setFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const applyFilter = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = URL.createObjectURL(image);

    img.onload = () => {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);
    };
  };

  const saveImage = () => {
    const canvas = document.getElementById('canvas');
    const dataURL = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'edited_image.png';
    link.click();
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <canvas id="canvas" width={400} height={400} />
      <div>
        <button onClick={() => setFilter('brightness')}>Brightness</button>
        <input type="range" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
        <button onClick={() => setFilter('contrast')}>Contrast</button>
        <input type="range" value={contrast} onChange={(e) => setContrast(e.target.value)} />
        <button onClick={() => setFilter('saturation')}>Saturation</button>
        <input type="range" value={saturation} onChange={(e) => setSaturation(e.target.value)} />
        <button onClick={applyFilter}>Apply</button>
        <button onClick={saveImage}>Save</button>
      </div>
    </div>
  );
};

export default PhotoEditor;