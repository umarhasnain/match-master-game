import React, { useState, useEffect } from 'react';

const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍍', '🥝', '🍓', '💣'];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * (symbols.length - 1))];

const GRID_SIZE = 8;
const TARGET_SCORE = 100;
const MAX_MOVES = 7;
const TIME_LIMIT = 120; // 2 minute

function App() {
  const [theme, setTheme] = useState('white');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [nextLevel, setNextLevel] = useState(false);
  const [level, setLevel] = useState(1);
  const [starAvailable, setStarAvailable] = useState(false);
  const [allLevelResults, setAllLevelResults] = useState([]);
  const [timer, setTimer] = useState(TIME_LIMIT);
  const [bombIndex, setBombIndex] = useState(null);

  // Timer countdown
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timer > 0 && score < TARGET_SCORE && moves < MAX_MOVES) {
        setTimer(prev => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timer, score, moves]);

  // Toggle theme between black and white
  const toggleTheme = () => {
    setTheme(theme === 'white' ? 'black' : 'white');
  };

  // Generate random cards
  const generateRandomCards = () => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }, () => getRandomSymbol());
  };

  useEffect(() => {
    setCards(generateRandomCards());
  }, [level]);

  // Flip card
  const flipCard = (index) => {
    if (flippedCards.length < 5 && !flippedCards.includes(index)) {
      setFlippedCards([...flippedCards, index]);
    }
  };

  // Handle bomb click (clears row and column)
  const handleBombClick = (index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    let newCards = [...cards];

    // Clear the row
    for (let i = 0; i < GRID_SIZE; i++) {
      newCards[row * GRID_SIZE + i] = getRandomSymbol();
    }

    // Clear the column
    for (let i = 0; i < GRID_SIZE; i++) {
      newCards[i * GRID_SIZE + col] = getRandomSymbol();
    }

    setCards(newCards);
    setBombIndex(null);
  };

  // Generate a hint (simple random move suggestion)
  const handleHint = () => {
    alert('Try matching three symbols at the top right!');
  };

  // Check for matches and update the board accordingly
  useEffect(() => {
    if (flippedCards.length >= 2) {
      const selectedSymbols = flippedCards.map(index => cards[index]);

      if (selectedSymbols.every(symbol => symbol === selectedSymbols[0])) {
        const matchCount = flippedCards.length;
        setScore(score + matchCount);
        setMoves(moves + 1);

        if (matchCount === 3) {
          setSliderValue(Math.min(sliderValue + 20, 100));
          setStarAvailable(true);
        }

        if (matchCount === 4) {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              flippedCards.includes(index) ? '💣' : card
            )
          );
          setBombIndex(flippedCards[0]);
        }

        setTimeout(() => {
          let newCards = [...cards];
          flippedCards.forEach(index => {
            newCards[index] = getRandomSymbol();
          });
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards]);

  // Handle star click (reset the board)
  const handleStarClick = () => {
    setCards(generateRandomCards());
    setStarAvailable(false);
    setFlippedCards([]);
    setScore(0);
  };

  // Handle the next level button
  const handleNextLevel = () => {
    setAllLevelResults([...allLevelResults, { level, score }]);
    setLevel(level + 1);
    setNextLevel(false);
    setSliderValue(0);
    setScore(0);
    setMoves(0);
    setTimer(TIME_LIMIT);
  };

  // Show all results
  const handleShowResults = () => {
    alert(`Results: ${allLevelResults.map(res => `Level ${res.level}: ${res.score} points`).join(', ')}`);
  };

  // End game if moves are exhausted or time runs out
  useEffect(() => {
    if (score >= TARGET_SCORE || moves >= MAX_MOVES || timer === 0) {
      alert('Game over! Try again.');
      handleNextLevel();
    }
  }, [moves, timer, score]);

  return (
    <div className={`min-h-screen ${theme === 'white' ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <div className="container py-10 text-center">
       <div className='flex justify-evenly items-center'>
       <h1 className="text-3xl font-bold mb-2">Match Master Game - Level {level}</h1>
        <button
          className="mb-5 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={toggleTheme}
        >
          Toggle {theme === 'white' ? 'Black' : 'White'} Theme
        </button>
       </div>

       <div className='flex justify-evenly items-center'>
       <div className="mb-5">
          <span className="text-xl">Score: {score}</span>
          <span className="text-xl ml-5">Moves: {moves}/{MAX_MOVES}</span>
          <span className="text-xl ml-5">Time: {timer}s</span>
        </div>

        {starAvailable && (
          <button
            className="mb-5 px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={handleStarClick}
          >
            ⭐ Star Available: Click to Reset Board!
          </button>
        )}

        <button
          className="mb-5 px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleHint}
        >
          Hint
        </button>
       </div>

<div className='flex justify-evenly items-center'>
<div className="mb-5">
          <input
            type="range"
            className="w-full"
            value={sliderValue}
            max="100"
            readOnly
          />
          <p>{sliderValue}% Complete</p>
        </div>

        {nextLevel && (
          <button
            className="mb-5 px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleNextLevel}
          >
            Next Level
          </button>
        )}

        <button
          className="mb-5 px-2 py-2 bg-purple-500 text-white rounded"
          onClick={handleShowResults}
        >
          Show Results
        </button>

</div>
       
        <div className="grid grid-cols-8 justify-center items-center w-[700px] ml-60">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`w-15 h-[50px] flex items-center justify-center border rounded 
                ${flippedCards.includes(index) ? 'bg-blue-300' : 'bg-gray-400'} 
                cursor-pointer`}
              onClick={() => {
                if (card === '💣') {
                  handleBombClick(index);
                } else {
                  flipCard(index);
                }
              }}
              style={{ margin: '0' }} // Remove any margin if present
            >
              <span className="text-3xl">{card}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
