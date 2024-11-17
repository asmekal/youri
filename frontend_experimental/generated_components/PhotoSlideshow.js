import React, { useState } from 'react';

const PhotoSlideshow = () => {
  const images = [
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/301',
    'https://picsum.photos/200/302',
  ];

  const transitionEffects = ['Fade', 'Slide', 'Zoom'];
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedEffect, setSelectedEffect] = useState('Fade');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="slideshow-container">
      <div
        className="image-container"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
          transition: `opacity ${selectedEffect.toLowerCase()} 1s`,
        }}
      />
      <div className="navigation-controls">
        <button onClick={handlePrevious}>&lt;</button>
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={handleNext}>&gt;</button>
      </div>
      <div className="transition-effects">
        {transitionEffects.map((effect, index) => (
          <button key={index} onClick={() => setSelectedEffect(effect)}>
            {effect}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhotoSlideshow;