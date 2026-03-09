import React from 'react';

export function UsernameInput({ value, onChange }) {
  return (
    <div className="input-group">
      <input 
        type="text" 
        placeholder="ENTER USERNAME" 
        value={value} 
        onChange={onChange}
        maxLength={12}
      />
    </div>
  );
}
