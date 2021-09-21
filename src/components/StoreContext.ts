import { noop } from 'lodash';
import { createContext, useCallback, useState } from 'react';
import { Move } from '../GamePage/components/Moves/types';
import { isValidTileCoordinates, TileCoordinates } from '../model/Coordinates';
import { BASIC_PILL_ID, EMPTY_TILE_ID, ENERGIZER_ID, FRUIT_ID, getPillsMatrix, TileId, TileMatrix, waysMatrix } from '../model/MazeData';


export const useGameContext = () => {
  const [paused, setPaused] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [pills, setPills] = useState<TileMatrix>(getPillsMatrix());
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<Move[]>([]);

  const pause = useCallback(() => setPaused(true), []);
  const unpause = useCallback(() => setPaused(false), []);

  const reset = useCallback(() => {
    setPaused(true);
    setPills(getPillsMatrix());
    setScore(0);
    setGameOver(false);
  }, []);

  const eatPill = useCallback((tileCoordinates: TileCoordinates) => {
    setPills((prev) => {
      if (
        isValidTileCoordinates(tileCoordinates) ||
        !waysMatrix[tileCoordinates.y][tileCoordinates.x]
      ) {
        setGameOver(true);
        return prev;
      }
      const pill: TileId = prev[tileCoordinates.y][tileCoordinates.x];
      if (pill === EMPTY_TILE_ID) {
        return prev;
      }
      let points = 0;
      if (pill === BASIC_PILL_ID) {
        points = 10;
      } else if (pill === ENERGIZER_ID) {
        points = 20;
      } else {
        const fruitId = pill - FRUIT_ID;
        switch (fruitId) {
          case 1:
            points = 400;
            break;
          case 2:
            points = 300;
            break;
          case 3:
            points = 250;
            break;
          case 4:
            points = 100;
            break;
          case 5:
            points = 50;
            break;
          case 7:
            points = 200;
            break;
        }
      }
      setScore((prev) => prev + points);
      return prev.map(
        (row, y) => y === tileCoordinates.y
          ? row.map((col, x) => x === tileCoordinates.x ? EMPTY_TILE_ID : col)
          : row
      );
    });
  }, []);

  return {
    paused,
    gameOver,
    pills,
    score,
    moves,
    eatPill,
    pause,
    unpause,
    reset,
    setMoves,
    setGameOver,
  };
};

type GameContextType = ReturnType<typeof useGameContext>;

const defaultState: GameContextType = {
  paused: true,
  gameOver: false,
  pills: [],
  score: 0,
  moves: [],
  pause: noop,
  unpause: noop,
  reset: noop,
  eatPill: noop,
  setMoves: noop,
  setGameOver: noop,
}

export const GameContext = createContext<GameContextType>(defaultState);
