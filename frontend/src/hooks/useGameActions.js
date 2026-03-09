import { useContext } from 'react';
import { socket } from '../services/socket';
import { GameContext } from '../context/GameContext';

export function useGameActions() {
  const {
    username,
    roomId,
    joinedRoom,
    setError,
    setShowJoinInput,
  } = useContext(GameContext);

  const handleCreateRoom = () => {
    if (!username.trim()) {
      setError('ENTER USERNAME');
      return;
    }
    socket.emit('create_room', username);
  };

  const handleJoinClick = () => {
    if (!username.trim()) {
      setError('ENTER USERNAME');
      return;
    }
    setShowJoinInput(true);
    setError('');
  };

  const submitJoinRoom = () => {
    if (!roomId.trim()) {
      setError('ENTER ROOM CODE');
      return;
    }
    socket.emit('join_room', { username, roomId });
  };

  const startGame = () => {
    socket.emit('start_game', joinedRoom);
  };

  return {
    handleCreateRoom,
    handleJoinClick,
    submitJoinRoom,
    startGame,
  };
}
