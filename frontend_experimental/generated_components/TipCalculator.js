import React, { useState } from 'react';

const TipCalculator = () => {
  const [billTotal, setBillTotal] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [splitBillBy, setSplitBillBy] = useState(1);
  const [totalPerPerson, setTotalPerPerson] = useState(0);

  const calculateTotalPerPerson = () => {
    const totalWithTip = billTotal + (billTotal * tipPercentage / 100);
    const totalPerPerson = totalWithTip / splitBillBy;
    setTotalPerPerson(totalPerPerson.toFixed(2));
  };

  return (
    <div className="tip-calculator">
      <h2>Tip Calculator</h2>
      <div className="input-fields">
        <label>Bill Total:</label>
        <input
          type="number"
          value={billTotal}
          onChange={(e) => setBillTotal(Number(e.target.value))}
        />
        <label>Tip Percentage:</label>
        <input
          type="number"
          value={tipPercentage}
          onChange={(e) => setTipPercentage(Number(e.target.value))}
        />
        <label>Split Bill By:</label>
        <input
          type="number"
          value={splitBillBy}
          onChange={(e) => setSplitBillBy(Number(e.target.value))}
        />
      </div>
      <button onClick={calculateTotalPerPerson}>Calculate</button>
      <div className="result">
        <p>Total Per Person: {totalPerPerson}</p>
      </div>
    </div>
  );
};

export default TipCalculator;