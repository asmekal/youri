import React, { useState, useEffect } from 'react';

const PomodoroTimer = () => {
  const [seconds, setSeconds] = useState(1500); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('work');
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (seconds === 0) {
      if (sessionType === 'work') {
        setSessionType('break');
        setSeconds(300); // 5 minutes
      } else {
        setSessionType('work');
        setSeconds(1500); // 25 minutes
      }
      setSessions((prevSessions) => [...prevSessions, sessionType]);
    }
  }, [seconds, sessionType]);

  const handleStartStop = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(1500);
    setSessionType('work');
    setSessions([]);
  };

  const getProgress = () => {
    if (sessionType === 'work') {
      return (1500 - seconds) / 1500;
    } else {
      return (300 - seconds) / 300;
    }
  };

  return (
    <div className="pomodoro-timer">
      <div className="timer">
        <svg width="200" height="200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={sessionType === 'work' ? 'red' : 'green'}
            strokeWidth="20"
            strokeDasharray={`calc(${getProgress()} * 565)`}
            strokeDashoffset="0"
          />
        </svg>
        <div className="time">{Math.floor(seconds / 60)}:{seconds % 60}</div>
      </div>
      <div className="sessions">
        {sessions.map((session, index) => (
          <div key={index} className={`session ${session}`}></div>
        ))}
      </div>
      <div className="controls">
        <button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroTimer;