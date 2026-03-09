import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { BuilderView } from './BuilderView';
import { GuideView } from './GuideView';

export function PlayingScreen() {
  const { myRole } = useContext(GameContext);

  return (
    <div className="playing-screen">
      <div className="game-header">
        <h2>ROLE: <span className="highlight-role">{myRole}</span></h2>
      </div>
      
      <div className="game-board-container">
        {myRole === 'Builder' ? <BuilderView /> : <GuideView />}
      </div>
    </div>
  );
}
