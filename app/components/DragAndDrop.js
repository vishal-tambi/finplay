"use client";
import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import { Timer, Gift, Award, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

// Expanded data with more challenging terms
const termsData = [
  { term: "Derivatives", definition: "Financial instruments whose value is derived from the performance of underlying assets." },
  { term: "P/E Ratio", definition: "A metric used to value a company by measuring its current share price relative to earnings per share." },
  { term: "Arbitrage", definition: "The practice of taking advantage of price differences between markets for the same asset." },
  { term: "Beta", definition: "A measure of a stock's volatility in relation to the overall market." },
  { term: "EBITDA", definition: "A measure of company profitability standing for Earnings Before Interest, Taxes, Depreciation, and Amortization." },
  { term: "Hedge", definition: "An investment position intended to offset potential losses in another investment." },
  { term: "Short Selling", definition: "The practice of borrowing shares to sell them, hoping to repurchase them at a lower price." },
  { term: "Yield Curve", definition: "A line plot of interest rates of bonds with equal credit quality but different maturity dates." }
];

const DragAndDrop = () => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [draggedTerm, setDraggedTerm] = useState(null);
  const [matchedTerms, setMatchedTerms] = useState([]);
  const [gameTime, setGameTime] = useState(180);
  const [isGameActive, setIsGameActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState([]);

  useEffect(() => {
    shuffleTerms();
  }, []);

  useEffect(() => {
    let timer;
    if (isGameActive && gameTime > 0) {
      timer = setInterval(() => {
        setGameTime(prev => prev - 1);
      }, 1000);
    } else if (gameTime === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isGameActive, gameTime]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const shuffleTerms = () => {
    const shuffled = [...termsData];
    // Shuffle terms and definitions
    shuffled.sort(() => Math.random() - 0.5);
    setShuffledTerms(shuffled);
    setShuffledDefinitions(shuffled.map(item => item.definition).sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setMatchedTerms([]);
    setGameTime(180);
    setStreak(0);
    shuffleTerms();
  };

  const endGame = () => {
    setIsGameActive(false);
    if (score > highScore) {
      setHighScore(score);
    }
    setFeedback({
      type: "success",
      message: `Game Over! Final Score: ${score} Points!`
    });
  };

  const handleDragStart = (term) => {
    if (!isGameActive) return;
    setDraggedTerm(term);
    setFeedback(null);
  };

  const handleDrop = (definition) => {
    if (!isGameActive) return;

    if (draggedTerm && draggedTerm.definition === definition) {
      const pointsEarned = 10 + (streak * 2);
      setScore(score + pointsEarned);
      setStreak(streak + 1);
      setMatchedTerms(prev => [...prev, draggedTerm.term]);
      setFeedback({
        type: "success",
        message: `Correct! +${pointsEarned} points! ${streak + 1} streak! 🎯`
      });

      if (matchedTerms.length + 1 === termsData.length) {
        endGame();
      }
    } else {
      setStreak(0);
      setFeedback({
        type: "error",
        message: "Incorrect! Streak reset! Try again! 💪"
      });
    }
    setDraggedTerm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-4">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-8">
        <TopBar score={score} />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span className="font-mono text-xl">
              {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <span>High Score: {highScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            <span>Streak: {streak}</span>
          </div>
        </div>
      </div>

      {!isGameActive && (
        <div className="text-center mb-8">
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition transform hover:scale-105"
          >
            {gameTime === 180 ? "Start Game" : "Play Again"}
          </button>
        </div>
      )}

      {/* Main Game Area */}
      <div className="flex justify-between items-start gap-8">
        {/* Terms Column */}
        <div className="w-1/3 space-y-4">
          <div className="bg-blue-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Financial Terms
              <RefreshCw
                className="w-5 h-5 cursor-pointer hover:rotate-180 transition-transform"
                onClick={shuffleTerms}
              />
            </h2>
            <div className="space-y-3">
              {shuffledTerms.map((item) => (
                <div
                  key={item.term}
                  className={`${
                    matchedTerms.includes(item.term)
                      ? "bg-green-600 opacity-50"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white py-3 px-4 rounded-lg cursor-pointer transition duration-300 transform hover:scale-105 ${!isGameActive ? "pointer-events-none opacity-50" : ""} shadow-md`}
                  draggable={!matchedTerms.includes(item.term)}
                  onDragStart={() => handleDragStart(item)}
                >
                  {item.term}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Definitions Column */}
        <div className="w-2/3 space-y-4">
          <div className="bg-blue-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Definitions</h2>
            <div className="space-y-4">
              {shuffledDefinitions.map((definition, index) => (
                <div
                  key={definition}
                  className={`bg-opacity-90 backdrop-blur-sm ${
                    matchedTerms.includes(definition) ? "bg-green-700" : "bg-gray-700"
                  } p-4 rounded-lg border-2 border-dashed ${
                    matchedTerms.includes(definition) ? "border-green-500" : "border-blue-300"
                  } transition duration-300 ${!isGameActive ? "pointer-events-none opacity-50" : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(definition)}
                >
                  {definition}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <Alert
          variant={feedback.type}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 min-w-[300px] animate-fade-in"
        >
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DragAndDrop;
