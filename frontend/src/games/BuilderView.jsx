import React from 'react';
import { GameGrid } from './GameGrid';

export function BuilderView() {
  return (
    <div className="builder-view">
      <h3>YOUR CANVAS</h3>
      <GameGrid />
    </div>
  );
}
