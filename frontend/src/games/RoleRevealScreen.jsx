import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export function RoleRevealScreen() {
  const { myRole } = useContext(GameContext);

  const getRoleDescription = () => {
    if (myRole === 'Guide') {
      return 'Direct the Builder to complete the structure.';
    }
    return 'Listen to the Guide and build the structure.';
  };

  return (
    <div className="role-reveal-screen">
      <div className="role-card">
        <h2>YOUR ROLE</h2>
        <p className="role-name">{myRole}</p>
        <p className="role-desc">{getRoleDescription()}</p>
      </div>
    </div>
  );
}
