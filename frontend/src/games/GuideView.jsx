import React from 'react';
import { GameGrid } from './GameGrid';

export function GuideView() {
  return (
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
  );
}
