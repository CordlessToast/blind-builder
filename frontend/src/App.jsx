import React, { useContext } from 'react';
import { GameContextProvider, GameContext } from './context/GameContext';
import { useSocketListeners } from './hooks/useSocketListeners';
import { VersionInfo, Header } from './components/Header';
import { ErrorMessage } from './components/ErrorMessage';
import { LobbyPage } from './pages/LobbyPage';
import { RoomPage } from './pages/RoomPage';
import { CountdownScreen } from './games/CountdownScreen';
import { LoadingScreen } from './games/LoadingScreen';
import { RoleRevealScreen } from './games/RoleRevealScreen';
import { PlayingScreen } from './games/PlayingScreen';
import './App.css';

function AppContent() {
  const { joinedRoom, gameStatus } = useContext(GameContext);
  useSocketListeners(); 

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
