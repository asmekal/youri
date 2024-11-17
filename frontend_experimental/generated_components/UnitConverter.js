import React, { useState } from 'react';

const UnitConverter = () => {
  const [unitType, setUnitType] = useState('length');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [convertedValue, setConvertedValue] = useState('');

  const handleConvert = () => {
    const conversionRates = {
      length: { km: 1000, m: 1, cm: 0.01, mm: 0.001 },
      weight: { kg: 1, g: 0.001, mg: 0.000001 },
      temperature: { celsius: 1, fahrenheit: 1, kelvin: 1 },
    };

    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;

    if (fromValue !== '') {
      const converted = parseFloat(fromValue) * conversionRates[unitType][fromUnit] / conversionRates[unitType][toUnit];
      setConvertedValue(converted.toFixed(2));
    }
  };

  return (
    <div>
      <h2>Unit Converter</h2>
      <select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temperature">Temperature</option>
      </select>
      <div>
        <input type="number" value={fromValue} onChange={(e) => setFromValue(e.target.value)} placeholder="From" />
        <select id="from-unit">
          {unitType === 'length' && (
            <>
              <option value="km">Kilometers</option>
              <option value="m">Meters</option>
              <option value="cm">Centimeters</option>
              <option value="mm">Millimeters</option>
            </>
          )}
          {unitType === 'weight' && (
            <>
              <option value="kg">Kilograms</option>
              <option value="g">Grams</option>
              <option value="mg">Milligrams</option>
            </>
          )}
          {unitType === 'temperature' && (
            <>
              <option value="celsius">Celsius</option>
              <option value="fahrenheit">Fahrenheit</option>
              <option value="kelvin">Kelvin</option>
            </>
          )}
        </select>
      </div>
      <div>
        <input type="number" value={toValue} onChange={(e) => setToValue(e.target.value)} placeholder="To" />
        <select id="to-unit">
          {unitType === 'length' && (
            <>
              <option value="km">Kilometers</option>
              <option value="m">Meters</option>
              <option value="cm">Centimeters</option>
              <option value="mm">Millimeters</option>
            </>
          )}
          {unitType === 'weight' && (
            <>
              <option value="kg">Kilograms</option>
              <option value="g">Grams</option>
              <option value="mg">Milligrams</option>
            </>
          )}
          {unitType === 'temperature' && (
            <>
              <option value="celsius">Celsius</option>
              <option value="fahrenheit">Fahrenheit</option>
              <option value="kelvin">Kelvin</option>
            </>
          )}
        </select>
      </div>
      <button onClick={handleConvert}>Convert</button>
      {convertedValue !== '' && <p>Result: {convertedValue}</p>}
    </div>
  );
};

export default UnitConverter;