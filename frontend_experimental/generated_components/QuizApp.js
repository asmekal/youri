import React, { useState } from 'react';

const QuizApp = () => {
  const [question, setQuestion] = useState('What is the capital of France?');
  const [answers, setAnswers] = useState([
    { id: 1, text: 'Paris', correct: true },
    { id: 2, text: 'London', correct: false },
    { id: 3, text: 'Berlin', correct: false },
    { id: 4, text: 'Rome', correct: false },
  ]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerChange = (id) => {
    setSelectedAnswer(id);
  };

  const handleSubmit = () => {
    const correctAnswer = answers.find((answer) => answer.correct);
    if (selectedAnswer === correctAnswer.id) {
      alert('Correct!');
    } else {
      alert('Incorrect. The correct answer is ' + correctAnswer.text);
    }
  };

  return (
    <div className="quiz-app">
      <div className="question-box">
        <h2>{question}</h2>
      </div>
      <div className="answers">
        {answers.map((answer) => (
          <div key={answer.id} className="answer">
            <input
              type="radio"
              id={answer.id}
              name="answer"
              value={answer.id}
              checked={selectedAnswer === answer.id}
              onChange={() => handleAnswerChange(answer.id)}
            />
            <label htmlFor={answer.id}>{answer.text}</label>
          </div>
        ))}
      </div>
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default QuizApp;