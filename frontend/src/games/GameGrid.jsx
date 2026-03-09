import React from 'react';

export function GameGrid() {
  return (
    <div className="grid-4x4">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="grid-cell"></div>
      ))}
    </div>
  );
}
