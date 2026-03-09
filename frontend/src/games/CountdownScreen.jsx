import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export function CountdownScreen() {
  const { countdown } = useContext(GameContext);

  return (
    <div className="countdown-screen">
      <h2>MATCH STARTING IN</h2>
      <div className="countdown-number">{countdown}</div>
    </div>
  );
}
