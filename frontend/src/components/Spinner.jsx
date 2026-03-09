import React from 'react';

export function Spinner({ size = 'normal' }) {
  const className = size === 'large' ? 'spinner large-spinner' : 'spinner';
  return <div className={className}></div>;
}
