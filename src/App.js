import React, { useEffect, useState } from 'react';
import './App.css';
import data from './question.json';  // Assuming your questions are stored in a JSON file
import correct from './sounds/correct.mp3';  // Correct answer sound
import wrong from './sounds/wrong.mp3';  // Incorrect answer sound

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectOption, setSelectOption] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(10);
  const [answers, setAnswers] = useState([]);  

  useEffect(() => {
    let interval;
    if (timer > 0 && !showScore) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      if (currentQuestion < data.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        setTimer(10);
        setSelectOption(null);
      } else {
        setShowScore(true);
      }
    }

    return () => clearInterval(interval);
  }, [timer, showScore, currentQuestion]);

  function restartQuiz() {
    setSelectOption(null);
    setScore(0);
    setShowScore(false);
    setTimer(10);
    setCurrentQuestion(0);
    setAnswers([]);  
  }

  const handleClick = (option) => {
    setSelectOption(option);
    const isCorrect = option === data[currentQuestion].correctOption;
 
    if (isCorrect) {
      setScore((prev) => prev + 1);
      const audio = new Audio(correct);
      audio.play();
    } else {
      const audio = new Audio(wrong);
      audio.play();
    }
 
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: data[currentQuestion].question, selected: option, correct: isCorrect },
    ]);
  };

  const handleNext = () => {
    if (currentQuestion < data.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setTimer(10);
      setSelectOption(null);
    } else {
      setShowScore(true);
    }
  };

 
  const correctAnswersCount = answers.filter((answer) => answer.correct).length;
  const incorrectAnswersCount = answers.filter((answer) => !answer.correct).length;

  return (
    <div>
      <div className="quiz-app">
        {showScore ? (
          <div className="score-section">
            <h2>Final Score: {score}/{data.length}</h2>
            <h3>Total Questions Answered: {data.length}</h3>
            <h3>Correct Answers: {correctAnswersCount}</h3>
            <h3>Incorrect Answers: {incorrectAnswersCount}</h3>
            <div className="answers-list">
              <h3>Answers Review:</h3>
              {answers.map((answer, index) => (
                <div key={index} className={`answer ${answer.correct ? 'correct' : 'incorrect'}`}>
                  <p><strong>Q{index + 1}: </strong>{answer.question}</p>
                  <p><strong>Your Answer: </strong>{answer.selected}</p>
                  <p><strong>{answer.correct ? 'Correct' : 'Incorrect'}</strong></p>
                </div>
              ))}
            </div>
            <button onClick={restartQuiz}>Restart</button>
          </div>
        ) : (
          <div className="question-section">
            <h2>QUESTION {currentQuestion + 1}</h2>
            <p>{data[currentQuestion].question}</p>
            <div className="options">
              {data[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(option)}
                  style={{
                    backgroundColor:
                      selectOption === option
                        ? option === data[currentQuestion].correctOption
                          ? 'green'
                          : 'red'
                        : '',
                  }}
                  disabled={!!selectOption}   
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="timer">
              Time Left: <span>{timer}</span>
            </div>
            {selectOption && (
              <button className="next-button" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
