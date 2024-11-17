import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const HabitTracker = () => {
  const data = [
    { name: 'Day 1', habitCompletion: 0.5 },
    { name: 'Day 2', habitCompletion: 0.8 },
    { name: 'Day 3', habitCompletion: 0.2 },
    { name: 'Day 4', habitCompletion: 0.9 },
    { name: 'Day 5', habitCompletion: 0.6 },
    { name: 'Day 6', habitCompletion: 0.4 },
    { name: 'Day 7', habitCompletion: 0.7 },
  ];

  const progress = (data.reduce((acc, curr) => acc + curr.habitCompletion, 0) / data.length) * 100;

  return (
    <div className="habit-tracker">
      <h2>Design a habit tracker chart</h2>
      <LineChart width={400} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="habitCompletion" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
      <div className="calendar-view">
        {data.map((day, index) => (
          <div key={index} className="day">
            {day.name}
          </div>
        ))}
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default HabitTracker;