import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export function ErrorMessage() {
  const { error } = useContext(GameContext);

  if (!error) return null;

  return <div className="error-message">{error}</div>;
}
