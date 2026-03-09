import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { PlayerList } from '../components/PlayerList';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Spinner } from '../components/Spinner';
import { useGameActions } from '../hooks/useGameActions';

export function RoomPage() {
  const { joinedRoom, username, players, isLeader } = useContext(GameContext);
  const { startGame } = useGameActions();

  return (
    <div className="room">
      <div className="room-header">
        <h2>ROOM: <span className="highlight-code">{joinedRoom}</span></h2>
        <p>PLAYER: {username}</p>
      </div>
      
      <div className="players-section">
        <h3>PLAYERS ({players.length}/2)</h3>
        <PlayerList />
      </div>

      {players.length < 2 ? (
        <div className="waiting-container">
          <Spinner />
          <p className="waiting-text">WAITING FOR PLAYERS...</p>
        </div>
      ) : (
        <div className="ready-container">
          <p className="ready-text">LOBBY FULL</p>
          {isLeader ? (
            <PrimaryButton className="start-btn" onClick={startGame}>
              START MATCH
            </PrimaryButton>
          ) : (
            <p className="waiting-text">WAITING FOR HOST...</p>
          )}
        </div>
      )}
    </div>
  );
}
