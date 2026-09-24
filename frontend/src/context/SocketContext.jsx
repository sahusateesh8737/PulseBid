import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, tenantId, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected, reconnecting
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const isDemoModeRef = useRef(false);

  useEffect(() => {
    // If no token or tenantId, close existing socket
    if (!token || !tenantId) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnectionStatus('disconnected');
      }
      return;
    }

    setConnectionStatus('connecting');

    const newSocket = io(WS_URL, {
      auth: {
        token,
        tenantId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      isDemoModeRef.current = false;
    });

    newSocket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', () => {
      setConnectionStatus((prev) => {
        if (prev === 'connected' || prev === 'connecting') return 'reconnecting';
        return 'disconnected';
      });
      setReconnectAttempts((prev) => prev + 1);
      // Fall back to demo mode gracefully if backend server is unreachable
      isDemoModeRef.current = true;
    });

    newSocket.io.on('reconnect_attempt', (attempt) => {
      setConnectionStatus('reconnecting');
      setReconnectAttempts(attempt);
    });

    newSocket.io.on('reconnect_failed', () => {
      setConnectionStatus('disconnected');
      // Enable simulated local socket for demo mode
      isDemoModeRef.current = true;
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, tenantId]);

  // Join a specific auction room
  const joinAuctionRoom = useCallback(
    (auctionId) => {
      if (socket && socket.connected) {
        socket.emit('join:auction', { auctionId, tenantId });
      }
    },
    [socket, tenantId]
  );

  // Leave auction room
  const leaveAuctionRoom = useCallback(
    (auctionId) => {
      if (socket && socket.connected) {
        socket.emit('leave:auction', { auctionId, tenantId });
      }
    },
    [socket, tenantId]
  );

  // Submit real-time bid via socket
  const placeBid = useCallback(
    (auctionId, amount) => {
      return new Promise((resolve, reject) => {
        if (socket && socket.connected) {
          socket.emit('bid:place', { auctionId, amount, tenantId }, (response) => {
            if (response?.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
            }
          });
        } else {
          // Local fallback handler if socket server is offline (Demo mode)
          resolve({
            success: true,
            isDemo: true,
            bid: {
              id: `bid_${Date.now()}`,
              auctionId,
              amount,
              bidderName: user?.name || 'Anonymous Bidder',
              bidderId: user?.id || 'usr_bidder_1',
              timestamp: new Date().toISOString(),
            },
          });
        }
      });
    },
    [socket, tenantId, user]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        connectionStatus,
        reconnectAttempts,
        isLiveConnected: connectionStatus === 'connected',
        joinAuctionRoom,
        leaveAuctionRoom,
        placeBid,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
