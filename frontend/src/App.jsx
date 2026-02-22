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
      setError('Please enter a username first');
      return;
    }
    socket.emit('create_room', username);
  };

  const handleJoinClick = () => {
    if (!username.trim()) {
      setError('Please enter a username first');
      return;
    }
    setShowJoinInput(true);
    setError('');
  };

  const submitJoinRoom = () => {
    if (!roomId.trim()) {
      setError('Please enter a room code');
      return;
    }
    socket.emit('join_room', { username, roomId });
  };

  const startGame = () => {
    socket.emit('start_game', joinedRoom);
  };

  return (
    <div className="app-container">
      <div className="logo-container">
        <h1 className="title">Blind Builder</h1>
        <div className="subtitle">Co-op Puzzle Game</div>
      </div>
      
      <div className="game-area">
        {error && <div className="error-message">{error}</div>}
        
        {!joinedRoom ? (
          <div className="lobby">
            <div className="input-group main-input">
              <input 
                type="text" 
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="center-text"
                maxLength={15}
              />
            </div>
            
            {!showJoinInput ? (
              <div className="action-buttons">
                <button className="btn primary" onClick={handleCreateRoom}>Create Room</button>
                <button className="btn secondary" onClick={handleJoinClick}>Join Room</button>
              </div>
            ) : (
              <div className="join-section slide-in">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Enter Room Code" 
                    value={roomId} 
                    onChange={(e) => setRoomId(e.target.value)} 
                    className="center-text room-code-input"
                    maxLength={10}
                  />
                </div>
                <div className="action-buttons">
                  <button className="btn primary" onClick={submitJoinRoom}>Join</button>
                  <button className="btn secondary" onClick={() => setShowJoinInput(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ) : gameStatus === 'lobby' ? (
          <div className="room slide-in">
            <div className="room-header">
              <h2>Room Code: <span className="highlight-code">{joinedRoom}</span></h2>
              <p>Welcome, <strong>{username}</strong>!</p>
            </div>
            
            <div className="players-section">
              <h3>👥 Players in Room ({players.length}/2)</h3>
              <ul className="player-list">
                {players.map((player, index) => (
                  <li key={index} className="player-item">
                    <div className="player-avatar">
                      {player.charAt(0).toUpperCase()}
                    </div>
                    <span className="player-name">{player} {isLeader && index === 0 ? '(Leader)' : ''}</span>
                  </li>
                ))}
              </ul>
            </div>

            {players.length < 2 ? (
              <div className="waiting-container">
                <div className="spinner"></div>
                <p className="waiting-text">Waiting for other players to join...</p>
              </div>
            ) : (
              <div className="ready-container slide-in">
                <p className="ready-text">All players are here!</p>
                {isLeader ? (
                  <button className="btn primary start-btn" onClick={startGame}>Start Game</button>
                ) : (
                  <p className="waiting-text">Waiting for leader to start the game...</p>
                )}
              </div>
            )}
          </div>
        ) : gameStatus === 'countdown' ? (
          <div className="countdown-screen slide-in">
            <h2>Game starting in</h2>
            <div className="countdown-number">{countdown}</div>
          </div>
        ) : gameStatus === 'loading' ? (
          <div className="loading-screen slide-in">
            <div className="spinner large-spinner"></div>
            <h2>Preparing Game...</h2>
          </div>
        ) : gameStatus === 'role_reveal' ? (
          <div className="role-reveal-screen slide-in">
            <h2>Your Role</h2>
            <div className={`role-card ${myRole.toLowerCase()}`}>
              <div className="role-icon">{myRole === 'Guide' ? '👁️' : '🔨'}</div>
              <div className="role-name">{myRole}</div>
            </div>
            <p className="role-desc">
              {myRole === 'Guide' 
                ? 'You can see the final picture. Guide the Builder!' 
                : 'You cannot see the picture. Listen to the Guide and build!'}
            </p>
          </div>
        ) : (
          <div className="playing-screen slide-in">
            <div className="game-header">
              <div className="role-badge">{myRole === 'Guide' ? '👁️ Guide' : '🔨 Builder'}</div>
              <div className="room-badge">Room: {joinedRoom}</div>
            </div>
            <div className="game-board-empty">
              <h3>Game Board</h3>
              <p>Game implementation goes here...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;