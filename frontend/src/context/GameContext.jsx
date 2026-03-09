import React, { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const GameContext = createContext();

export function GameContextProvider({ children }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [isInLobby, setIsInLobby] = useState(true);
  const [error, setError] = useState('');
  const [players, setPlayers] = useState([]);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [gameStatus, setGameStatus] = useState('lobby');
  const [countdown, setCountdown] = useState(5);
  const [myRole, setMyRole] = useState('');

  const value = {
    username,
    setUsername,
    roomId,
    setRoomId,
    joinedRoom,
    setJoinedRoom,
    isInLobby,
    setIsInLobby,
    error,
    setError,
    players,
    setPlayers,
    showJoinInput,
    setShowJoinInput,
    isLeader,
    setIsLeader,
    gameStatus,
    setGameStatus,
    countdown,
    setCountdown,
    myRole,
    setMyRole,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
