import React from 'react';

export function RoomCodeInput({ value, onChange }) {
  return (
    <div className="input-group">
      <input 
        type="text" 
        placeholder="ROOM CODE" 
        value={value} 
        onChange={onChange}
        className="room-code-input"
        maxLength={10}
      />
    </div>
  );
}
