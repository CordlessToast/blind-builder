import { useEffect, useContext } from 'react';
import { socket } from '../services/socket';
import { GameContext } from '../context/GameContext';

export function useSocketListeners() {
  const {
    username,
    setJoinedRoom,
    setIsInLobby,
    setIsLeader,
    setError,
    setPlayers,
    setMyRole,
    setGameStatus,
    setCountdown,
  } = useContext(GameContext);

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
      setTimeout(() => setError(''), 3000);
    });

    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('update_players');
      socket.off('game_starting');
      socket.off('error');
    };
  }, [username, setJoinedRoom, setIsInLobby, setIsLeader, setError, setPlayers, setMyRole, setGameStatus, setCountdown]);
}
