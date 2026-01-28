import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : "https://flyrr-1.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});
