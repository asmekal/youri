import React, { useState } from 'react';

const BMICalculator = () => {
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [category, setCategory] = useState('');

  const calculateBmi = () => {
    const bmiValue = weight / (height / 100) ** 2;
    setBmi(bmiValue.toFixed(2));

    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue < 25) {
      setCategory('Normal');
    } else if (bmiValue < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  return (
    <div className="bmi-calculator">
      <h2>BMI Calculator</h2>
      <input
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <button onClick={calculateBmi}>Calculate BMI</button>
      {bmi > 0 && (
        <div className="result">
          <p>BMI: {bmi}</p>
          <p>Category: {category}</p>
          <div className="gauge">
            <div
              className="gauge-bar"
              style={{
                width: `${(bmi / 40) * 100}%`,
                backgroundColor:
                  category === 'Underweight'
                    ? 'blue'
                    : category === 'Normal'
                    ? 'green'
                    : category === 'Overweight'
                    ? 'orange'
                    : 'red',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;