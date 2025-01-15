"use client";
import React, { useState, useEffect } from "react";
import quizData from "../data/quizData"; // Import your quiz data
import TopBar from "./TopBar"; // Reuse the TopBar component
import Confetti from "react-confetti"; // Add this for confetti animation

const QuizGame = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // Confetti state

  const currentQuestion = quizData[currentQuestionIndex];

  // Timer Effect
  useEffect(() => {
    if (timeLeft > 0 && !isTimeUp) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsTimeUp(true);
      setFeedback("Time's up! The correct answer is revealed.");
    }
  }, [timeLeft, isTimeUp]);

  const handleAnswerClick = (choice) => {
    if (isTimeUp) return;

    if (choice === currentQuestion.correctAnswer) {
      setFeedback("Correct! Well done!");
      setScore(score + 10); // Increment score
      setShowConfetti(true); // Trigger confetti
      setTimeout(() => setShowConfetti(false), 3000); // Stop confetti after 3 seconds
    } else {
      setFeedback("Incorrect! Better luck next time.");
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback(null);
      setTimeLeft(60); // Reset timer
      setIsTimeUp(false); // Reset time-up state
    } else {
      setFeedback("Congratulations! You've completed the quiz.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Confetti Effect */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Pass the score to TopBar */}
      <TopBar score={score} />

      {/* Question Display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => handleAnswerClick(choice)}
              disabled={isTimeUp}
            >
              {choice}
            </button>
          ))}
        </div>
        {feedback && <p className="mt-4 text-lg font-bold">{feedback}</p>}
        {isTimeUp && (
          <p className="mt-2 text-sm">
            Correct Answer: {currentQuestion.correctAnswer}
          </p>
        )}
        <button
          className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          onClick={nextQuestion}
        >
          {currentQuestionIndex < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </button>
      </div>

      {/* Timer and Hint */}
      <div className="absolute top-1/2 right-40 transform -translate-y-1/2 text-center">
        <p className="text-sm bg-[#FFCF40] hover:bg-[#FEBC33] p-3 rounded-xl text-black font-bold font-game mb-2">
          : {timeLeft}s
        </p>
        <button
          className="p-3 text-5xl rounded hover:bg-blue-400 bg-blue-500 rounded-2xl [text-shadow:4px_4px_black] [--webkit-text-stroke:4px_black]"
          onClick={() => setShowHint(true)}
        >
          💡
        </button>
      </div>

      {/* Hint Modal */}
      {showHint && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-black w-1/2">
            <h2 className="text-2xl font-bold mb-4">Hint</h2>
            <p>{currentQuestion.hint}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
              onClick={() => setShowHint(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
