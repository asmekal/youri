import React, { useState } from 'react';

const RandomNamePicker = () => {
  const [names, setNames] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [pickedName, setPickedName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue !== '') {
      setNames([...names, inputValue]);
      setInputValue('');
    }
  };

  const handlePick = () => {
    if (names.length > 0) {
      const randomIndex = Math.floor(Math.random() * names.length);
      setPickedName(names[randomIndex]);
    }
  };

  return (
    <div className="random-name-picker">
      <h2>Random Name Picker Tool</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a name"
        />
        <button type="submit">Add Name</button>
      </form>
      <button onClick={handlePick}>Pick a Name</button>
      <div className="picked-name">
        {pickedName ? <p>Picked Name: {pickedName}</p> : <p>No name picked yet</p>}
      </div>
      <div className="names-list">
        <h3>Entered Names:</h3>
        <ul>
          {names.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RandomNamePicker;