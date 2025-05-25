import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

// Extract the base URL without /api for Socket.IO
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, token } = useAuth();
  
  useEffect(() => {
    // Only connect if user is authenticated
    if (isAuthenticated && token) {
      console.log(`Attempting to connect to Socket.IO at: ${SOCKET_URL}`);
      
      const socketInstance = io(SOCKET_URL, {
        auth: {
          token
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      socketInstance.on('connect', () => {
        console.log(`Socket connected successfully: ${socketInstance.id}`);
      });
      
      socketInstance.on('connect_error', (err) => {
        console.error(`Socket connection error: ${err.message}`);
        console.error('Connection details:', {
          url: SOCKET_URL,
          authenticated: isAuthenticated,
          hasToken: !!token
        });
      });
      
      socketInstance.on('disconnect', (reason) => {
        console.log(`Socket disconnected: ${reason}`);
      });
      
      socketInstance.on('reconnect', (attemptNumber) => {
        console.log(`Socket reconnected after ${attemptNumber} attempts`);
      });
      
      setSocket(socketInstance);
      
      return () => {
        console.log('Cleaning up socket connection');
        socketInstance.disconnect();
      };
    } else if (socket) {
      // Disconnect if user logs out
      console.log('User logged out, disconnecting socket');
      socket.disconnect();
      setSocket(null);
    } else {
      console.log('Socket not initialized: User not authenticated or missing token');
    }
  }, [isAuthenticated, token]);
  
  return socket;
};

export default useSocket;
