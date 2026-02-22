import { io } from 'socket.io-client';

// Replace the URL with your backend server's URL and port
const URL = 'http://localhost:3000'; 

export const socket = io(URL);