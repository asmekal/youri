import React, { useState, useEffect } from 'react';

const StopwatchApp = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [lapTimes, setLapTimes] = useState([]);
  const [lapNumber, setLapNumber] = useState(1);

  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleLap = () => {
    if (isActive) {
      setLapTimes((prevLapTimes) => [...prevLapTimes, `${lapNumber}: ${formatTime(timer)}`]);
      setLapNumber((prevLapNumber) => prevLapNumber + 1);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimer(0);
    setLapTimes([]);
    setLapNumber(1);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="stopwatch-app">
      <h1>Stopwatch App</h1>
      <div className="timer-display">
        <span>{formatTime(timer)}</span>
      </div>
      <div className="buttons">
        <button onClick={handleStartStop}>{isActive ? 'Stop' : 'Start'}</button>
        <button onClick={handleLap}>Lap</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className="lap-times">
        <h2>Lap Times</h2>
        <ul>
          {lapTimes.map((lapTime, index) => (
            <li key={index}>{lapTime}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StopwatchApp;