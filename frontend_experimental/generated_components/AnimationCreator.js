import React, { useState } from 'react';

const shapes = [
  { id: 1, type: 'circle', x: 10, y: 10, width: 50, height: 50 },
  { id: 2, type: 'square', x: 70, y: 10, width: 50, height: 50 },
  { id: 3, type: 'triangle', x: 130, y: 10, width: 50, height: 50 },
];

const toolbarOptions = [
  { id: 1, label: 'Duration', type: 'range', min: 1, max: 10 },
  { id: 2, label: 'Frame Rate', type: 'range', min: 1, max: 60 },
  { id: 3, label: 'Play', type: 'button' },
  { id: 4, label: 'Save', type: 'button' },
  { id: 5, label: 'Load', type: 'button' },
];

const AnimationCreator = () => {
  const [selectedShape, setSelectedShape] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const handleMouseDown = (event, shape) => {
    setSelectedShape(shape);
    setDragging(true);
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const shape = selectedShape;
      shape.x = event.clientX;
      shape.y = event.clientY;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleResize = (event, shape) => {
    setResizing(true);
    shape.width = event.clientX - shape.x;
    shape.height = event.clientY - shape.y;
  };

  return (
    <div className="animation-creator">
      <canvas
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={shape.type}
            style={{
              left: shape.x,
              top: shape.y,
              width: shape.width,
              height: shape.height,
            }}
          >
            {shape.type === 'triangle' && (
              <div className="triangle-corner" onMouseDown={(event) => handleResize(event, shape)} />
            )}
          </div>
        ))}
      </canvas>
      <div className="toolbar">
        {toolbarOptions.map((option) => (
          <div key={option.id} className={option.type}>
            {option.type === 'range' ? (
              <input
                type="range"
                min={option.min}
                max={option.max}
                defaultValue={5}
              />
            ) : (
              <button>{option.label}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimationCreator;