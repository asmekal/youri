import React, { useState, useEffect } from 'react';
// as long as there's folder ./generated components - should work.
// ^every .js there should have export default WeatherDashboard; (component name is arbitrary)

function App() {
  // Dynamically import all components from the generated_components folder
  const componentsContext = require.context('./generated_components', false, /\.js$/);
  const componentList = componentsContext.keys().map((key) => {
    const Component = componentsContext(key).default;
    return Component;
  });

  // State to keep track of the currently displayed component
  const [currentIndex, setCurrentIndex] = useState(0);

  // Event handlers for navigating between components
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % componentList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + componentList.length) % componentList.length);
  };

  // Current component to display
  const CurrentComponent = componentList[currentIndex];

  return (
    <div>
      <div>
        <button onClick={handlePrev} disabled={componentList.length === 0}>Previous</button>
        <button onClick={handleNext} disabled={componentList.length === 0}>Next</button>
      </div>
      <div>
        {componentList.length > 0 ? (
          <CurrentComponent />
        ) : (
          <p>No components available</p>
        )}
      </div>
    </div>
  );
}

export default App;

