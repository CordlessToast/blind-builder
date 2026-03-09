import React from 'react';

export function Header() {
  return (
    <div className="logo-container">
      <h1 className="title">Blind Builder</h1>
    </div>
  );
}

export function VersionInfo() {
  return <div className="version-info">v1.0.0</div>;
}
