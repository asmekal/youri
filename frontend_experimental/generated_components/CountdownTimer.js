import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [duration, setDuration] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsRunning(false);
          alert('Alarm triggered!');
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, minutes, seconds]);

  const handleStart = () => {
    setIsRunning(true);
    const totalSeconds = duration * 60;
    setMinutes(Math.floor(totalSeconds / 60));
    setSeconds(totalSeconds % 60);
  };

  const handleSliderChange = (e) => {
    setDuration(e.target.value);
  };

  return (
    <div className="countdown-timer">
      <h2>Countdown Timer with Alarm</h2>
      <div className="timer-display">
        <span>{minutes.toString().padStart(2, '0')}:</span>
        <span>{seconds.toString().padStart(2, '0')}</span>
      </div>
      <div className="timer-controls">
        <input
          type="range"
          min="1"
          max="60"
          value={duration}
          onChange={handleSliderChange}
        />
        <span>Duration (minutes): {duration}</span>
        <button onClick={handleStart}>Start</button>
        <i className="fas fa-bell"></i>
      </div>
    </div>
  );
};

export default CountdownTimer;