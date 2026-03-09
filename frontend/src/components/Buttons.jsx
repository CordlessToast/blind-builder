import React from 'react';

export function PrimaryButton({ children, onClick }) {
  return (
    <button className="btn primary" onClick={onClick}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick }) {
  return (
    <button className="btn secondary" onClick={onClick}>
      {children}
    </button>
  );
}
