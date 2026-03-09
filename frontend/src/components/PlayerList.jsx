import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export function PlayerList() {
  const { players, isLeader } = useContext(GameContext);

  return (
    <ul className="player-list">
      {players.map((player, index) => (
        <li key={index} className="player-item">
          <div className="player-avatar">
            {player.charAt(0).toUpperCase()}
          </div>
          <span className="player-name">
            {player} {isLeader && index === 0 ? '[HOST]' : ''}
          </span>
        </li>
      ))}
    </ul>
  );
}
