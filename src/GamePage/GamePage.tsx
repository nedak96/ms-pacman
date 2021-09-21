import React, { memo, useContext } from 'react';
import { Board } from '../components/Board';
import { GameOver } from './components/GameOver';
import { MazeView } from './components/MazeView';
import { PacManView } from './components/PacManView';
import { PillsView } from './components/PillsView';
import { Score } from './components/Score';
import { GameContext } from '../components/StoreContext';
import './GamePage.css';
import { MovesView } from './components/Moves/MovesView';
import { GameControls } from './components/GameControls';

export const GamePage: React.FC = memo(() => {
  const { gameOver } = useContext(GameContext);

  return (
    <div className="MainContainer">
      <div className="RowContainer">
        <div className="ColumnContainer">
          <Score />
          <Board>
            <MazeView />
            <PillsView />
            <PacManView />
            {gameOver && <GameOver />}
          </Board>
          <GameControls />
        </div>
        <div className="ColumnContainer">
          <MovesView />
        </div>
      </div>
    </div>
  );
});
