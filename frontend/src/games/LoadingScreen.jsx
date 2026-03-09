import React from 'react';
import { Spinner } from '../components/Spinner';

export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <Spinner size="large" />
      <h2>LOADING MAP...</h2>
    </div>
  );
}
