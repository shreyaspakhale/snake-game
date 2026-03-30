import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 80;
const TRAIL_MAX_LIFE = 8;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [trail, setTrail] = useState<{ x: number, y: number, life: number }[]>([]);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setTrail([]);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood());
      } else {
        const tail = newSnake.pop();
        if (tail) {
          setTrail(prevTrail => [
            { ...tail, life: TRAIL_MAX_LIFE },
            ...prevTrail.map(t => ({ ...t, life: t.life - 1 })).filter(t => t.life > 0)
          ]);
        }
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case 'Enter':
          if (gameOver) resetGame();
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, gameOver, moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-2 bg-black border-2 border-magenta-500 shadow-[4px_4px_0_#0ff]">
      <div 
        className="grid bg-black border-2 border-cyan-400"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          aspectRatio: '1/1',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;
          const trailSegment = trail.find(t => t.x === x && t.y === y);

          return (
            <div
              key={i}
              className={`w-full h-full border-[1px] border-magenta-500/10 ${
                isHead ? 'bg-cyan-400 shadow-[0_0_10px_#0ff] z-20' :
                isSnake ? 'bg-magenta-500 z-10' :
                isFood ? 'bg-white animate-pulse z-10' : ''
              }`}
              style={{
                backgroundColor: isFood ? '#fff' : trailSegment ? `rgba(255, 0, 255, ${trailSegment.life / (TRAIL_MAX_LIFE * 2)})` : undefined,
              }}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {(gameOver || isPaused) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10"
          >
            {gameOver ? (
              <>
                <h2 className="text-5xl font-bold text-magenta-500 mb-4 glitch-text">CRITICAL_FAILURE</h2>
                <p className="text-cyan-400 mb-6 text-xl">YIELD: {score}</p>
              </>
            ) : (
              <h2 className="text-5xl font-bold text-cyan-400 mb-6 glitch-text">EXECUTION_HALTED</h2>
            )}
            <button
              onClick={gameOver ? resetGame : () => setIsPaused(false)}
              className="px-10 py-4 bg-magenta-500 hover:bg-white text-black font-bold text-xl transition-all border-4 border-cyan-400 shadow-[6px_6px_0_#0ff] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {gameOver ? 'REBOOT' : 'RESUME'}
            </button>
            <p className="mt-6 text-sm text-cyan-400/60 uppercase tracking-widest animate-pulse">INITIATE_SEQUENCE_VIA_INPUT</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
