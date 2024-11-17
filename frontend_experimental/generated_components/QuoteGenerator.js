import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuoteGenerator = () => {
  const [quote, setQuote] = useState({});
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    fetchQuote();
    fetchBackgroundImage();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await axios.get('https://api.quotable.io/random');
      setQuote(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBackgroundImage = async () => {
    try {
      const response = await axios.get('https://picsum.photos/200/300');
      setBackgroundImage(response.config.url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewQuote = () => {
    fetchQuote();
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        height: '300px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <div style={{ padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <h2 style={{ fontSize: '24px' }}>{quote.content}</h2>
        <p style={{ fontSize: '18px', fontStyle: 'italic' }}>
          - {quote.author}
        </p>
        <button
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleNewQuote}
        >
          New Quote
        </button>
      </div>
    </div>
  );
};

export default QuoteGenerator;