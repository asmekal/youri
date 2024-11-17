import React, { useState } from 'react';
import WordCloud from 'wordcloud';

const WordCloudGenerator = () => {
  const [text, setText] = useState('');
  const [words, setWords] = useState({});

  const handleGenerate = () => {
    const wordList = text.split(' ');
    const wordFrequency = {};

    wordList.forEach((word) => {
      if (wordFrequency[word]) {
        wordFrequency[word]++;
      } else {
        wordFrequency[word] = 1;
      }
    });

    setWords(wordFrequency);

    const canvas = document.getElementById('word-cloud');
    WordCloud(canvas, {
      list: Object.keys(wordFrequency).map((word) => ({
        text: word,
        size: wordFrequency[word] * 10,
      })),
      color: 'random',
      rotation: () => Math.random() * 60 - 30,
    });
  };

  return (
    <div>
      <h2>Word Cloud Generator</h2>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
      />
      <button onClick={handleGenerate}>Generate</button>
      <canvas id="word-cloud" width="400" height="200"></canvas>
    </div>
  );
};

export default WordCloudGenerator;