import { memo, useContext } from 'react';
import { GameContext } from '../../components/StoreContext';
import './Score.css';

export const Score = memo(() => {
  const { score } = useContext(GameContext);

  return (
    <div className="Score">
      <span>Score</span>
      <span>{score}</span>
    </div>
  );
});
