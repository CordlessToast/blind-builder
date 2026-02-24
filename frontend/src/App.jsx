import React, { useState, useEffect } from 'react';
import { playerConnection } from './playerConnection';
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
  const [gameStatus, setGameStatus] = useState('lobby'); 
  const [countdown, setCountdown] = useState(5);
  const [myRole, setMyRole] = useState('');

  useEffect(() => {
    playerConnection.on('room_created', (id) => {
      setJoinedRoom(id);
      setIsInLobby(false);
      setIsLeader(true);
      setError('');
    });

    playerConnection.on('room_joined', (id) => {
      setJoinedRoom(id);
      setIsInLobby(false);
      setIsLeader(false);
      setError('');
    });

    playerConnection.on('update_players', (playerList) => {
      setPlayers(playerList);
    });

    playerConnection.on('game_starting', (roles) => {
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

    playerConnection.on('error', (msg) => {
      setError(msg);
      setTimeout(() => setError(''), 3000); // Auto hide error
    });

    return () => {
      playerConnection.off('room_created');
      playerConnection.off('room_joined');
      playerConnection.off('update_players');
      playerConnection.off('game_starting');
      playerConnection.off('error');
    };
  }, [username]);

  const handleCreateRoom = () => {
    if (!username.trim()) {
      setError('ENTER USERNAME');
      return;
    }
    playerConnection.emit('create_room', username);
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
    playerConnection.emit('join_room', { username, roomId });
  };

  const startGame = () => {
    playerConnection.emit('start_game', joinedRoom);
  };

  return (
    <div className="app-container">
      <div className="version-info">v1.0.0</div>
      
      <div className="logo-container">
        <h1 className="title">Blind Builder</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="game-area">
        {!joinedRoom ? (
          <div className="lobby">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="ENTER USERNAME" 
                value={username} 
                onChange={(e) => setUsername(e.target.value.toUpperCase())} 
                maxLength={12}
              />
            </div>
            
            {!showJoinInput ? (
              <div className="action-buttons">
                <button className="btn primary" onClick={handleCreateRoom}>Host Game</button>
                <button className="btn secondary" onClick={handleJoinClick}>Join Game</button>
              </div>
            ) : (
              <div className="join-section">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="ROOM CODE" 
                    value={roomId} 
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())} 
                    className="room-code-input"
                    maxLength={10}
                  />
                </div>
                <div className="action-buttons">
                  <button className="btn primary" onClick={submitJoinRoom}>Connect</button>
                  <button className="btn secondary" onClick={() => setShowJoinInput(false)}>Back</button>
                </div>
              </div>
            )}
          </div>
        ) : gameStatus === 'lobby' ? (
          <div className="room">
            <div className="room-header">
              <h2>ROOM: <span className="highlight-code">{joinedRoom}</span></h2>
              <p>PLAYER: {username}</p>
            </div>
            
            <div className="players-section">
              <h3>PLAYERS ({players.length}/2)</h3>
              <ul className="player-list">
                {players.map((player, index) => (
                  <li key={index} className="player-item">
                    <div className="player-avatar">
                      {player.charAt(0).toUpperCase()}
                    </div>
                    <span className="player-name">{player} {isLeader && index === 0 ? '[HOST]' : ''}</span>
                  </li>
                ))}
              </ul>
            </div>

            {players.length < 2 ? (
              <div className="waiting-container">
                <div className="spinner"></div>
                <p className="waiting-text">WAITING FOR PLAYERS...</p>
              </div>
            ) : (
              <div className="ready-container">
                <p className="ready-text">LOBBY FULL</p>
                {isLeader ? (
                  <button className="btn primary start-btn" onClick={startGame}>START MATCH</button>
                ) : (
                  <p className="waiting-text">WAITING FOR HOST...</p>
                )}
              </div>
            )}
          </div>
        ) : gameStatus === 'countdown' ? (
          <div className="countdown-screen">
            <h2>MATCH STARTING IN</h2>
            <div className="countdown-number">{countdown}</div>
          </div>
        ) : gameStatus === 'loading' ? (
          <div className="loading-screen">
            <div className="spinner large-spinner"></div>
            <h2>LOADING MAP...</h2>
          </div>
        ) : gameStatus === 'role_reveal' ? (
          <div className="role-reveal-screen">
            <div className="role-card">
              <h2>YOUR ROLE</h2>
              <p className="role-name">{myRole}</p>
              <p className="role-desc">
                {myRole === 'Guide' 
                  ? 'Direct the Builder to complete the structure.' 
                  : 'Listen to the Guide and build the structure.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="playing-screen">
            <div className="game-header">
              <h2>ROLE: <span className="highlight-role">{myRole}</span></h2>
            </div>
            
            <div className="game-board-container">
              {myRole === 'Builder' ? (
                <div className="builder-view">
                  <h3>YOUR CANVAS</h3>
                  <div className="grid-4x4">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="grid-cell"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="guide-view">
                  <div className="guide-grid-container">
                    <h3>TARGET DESIGN</h3>
                    <div className="grid-4x4 target-grid">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="grid-cell"></div>
                      ))}
                    </div>
                  </div>
                  <div className="guide-grid-container">
                    <h3>BUILDER'S CANVAS</h3>
                    <div className="grid-4x4 builder-progress-grid">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="grid-cell"></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
