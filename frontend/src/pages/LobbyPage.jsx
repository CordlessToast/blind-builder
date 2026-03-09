import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { UsernameInput } from '../components/UsernameInput';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { RoomCodeInput } from '../components/RoomCodeInput';
import { useGameActions } from '../hooks/useGameActions';

export function LobbyPage() {
  const { username, setUsername, roomId, setRoomId, showJoinInput, setShowJoinInput } = useContext(GameContext);
  const { handleCreateRoom, handleJoinClick, submitJoinRoom } = useGameActions();

  return (
    <div className="lobby">
      <UsernameInput 
        value={username} 
        onChange={(e) => setUsername(e.target.value.toUpperCase())}
      />
      
      {!showJoinInput ? (
        <div className="action-buttons">
          <PrimaryButton onClick={handleCreateRoom}>Host Game</PrimaryButton>
          <SecondaryButton onClick={handleJoinClick}>Join Game</SecondaryButton>
        </div>
      ) : (
        <div className="join-section">
          <RoomCodeInput 
            value={roomId} 
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          />
          <div className="action-buttons">
            <PrimaryButton onClick={submitJoinRoom}>Connect</PrimaryButton>
            <SecondaryButton onClick={() => showJoinInput && setShowJoinInput(false)}>
              Back
            </SecondaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
