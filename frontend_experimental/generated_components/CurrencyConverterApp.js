import React, { useState, useEffect } from 'react';

const CurrencyConverterApp = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];

  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then(response => response.json())
      .then(data => {
        setExchangeRate(data.rates[toCurrency]);
        setConvertedAmount(amount * data.rates[toCurrency]);
      });
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = () => {
    setConvertedAmount(amount * exchangeRate);
  };

  return (
    <div className="currency-converter">
      <h2>Real-time Currency Converter</h2>
      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="swap-button">
        <button onClick={handleSwapCurrencies}>Swap</button>
      </div>
      <div className="input-group">
        <input
          type="number"
          value={convertedAmount}
          readOnly
          placeholder="Converted Amount"
        />
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleConvert}>Convert</button>
      <p>Exchange Rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}</p>
    </div>
  );
};

export default CurrencyConverterApp;