import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [isInLobby, setIsInLobby] = useState(true);
  const [error, setError] = useState('');
  const [players, setPlayers] = useState([]);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [gameStatus, setGameStatus] = useState('lobby'); // lobby, countdown, loading, role_reveal, playing
  const [countdown, setCountdown] = useState(5);
  const [myRole, setMyRole] = useState('');

  useEffect(() => {
    socket.on('room_created', (id) => {
      setJoinedRoom(id);
      setIsInLobby(false);
      setIsLeader(true);
      setError('');
    });

    socket.on('room_joined', (id) => {
      setJoinedRoom(id);
      setIsInLobby(false);
      setIsLeader(false);
      setError('');
    });

    socket.on('update_players', (playerList) => {
      setPlayers(playerList);
    });

    socket.on('game_starting', (roles) => {
      setMyRole(roles[username]);
      setGameStatus('countdown');
      
      let count = 5;
      setCountdown(count);
      
      const timer = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown(count);
        } else {
          clearInterval(timer);
          setGameStatus('loading');
          
          setTimeout(() => {
            setGameStatus('role_reveal');
            
            setTimeout(() => {
              setGameStatus('playing');
            }, 3000); 
          }, 2000); 
        }
      }, 1000);
    });

    socket.on('error', (msg) => {
      setError(msg);
      setTimeout(() => setError(''), 3000); // Auto hide error
    });

    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('update_players');
      socket.off('game_starting');
      socket.off('error');
    };
  }, [username]);

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

  return (
    <div className="app-container">
      <VersionInfo />      
      <Header />
      <ErrorMessage />
      
      <div className="game-area">
        {!joinedRoom ? (
          <LobbyPage />
        ) : gameStatus === 'lobby' ? (
          <RoomPage />
        ) : gameStatus === 'countdown' ? (
          <CountdownScreen />
        ) : gameStatus === 'loading' ? (
          <LoadingScreen />
        ) : gameStatus === 'role_reveal' ? (
          <RoleRevealScreen />
        ) : (
          <PlayingScreen />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <GameContextProvider>
      <AppContent />
    </GameContextProvider>
  );
}

export default App;
