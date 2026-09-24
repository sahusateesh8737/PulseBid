import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, tenantId, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Custom event listener mappings (since native WS doesn't have named events)
  const listeners = useRef(new Map());

  const addListener = useCallback((event, callback) => {
    if (!listeners.current.has(event)) {
      listeners.current.set(event, new Set());
    }
    listeners.current.get(event).add(callback);
  }, []);

  const removeListener = useCallback((event, callback) => {
    if (listeners.current.has(event)) {
      listeners.current.get(event).delete(callback);
    }
  }, []);

  const triggerEvent = useCallback((event, data) => {
    if (listeners.current.has(event)) {
      for (const callback of listeners.current.get(event)) {
        callback(data);
      }
    }
  }, []);

  useEffect(() => {
    if (!token || !tenantId) {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnectionStatus('disconnected');
      }
      return;
    }

    setConnectionStatus('connecting');
    const wsUrl = new URL(WS_URL);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl.pathname = '/ws';
    wsUrl.searchParams.set('token', token);

    const newSocket = new WebSocket(wsUrl.toString());

    newSocket.onopen = () => {
      setConnectionStatus('connected');
      setReconnectAttempts(0);
    };

    newSocket.onclose = () => {
      setConnectionStatus('disconnected');
      setSocket(null);
    };

    newSocket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // The backend sends { type: 'bid.placed', auctionId, amount, bidderId, timestamp }
        // Let's map it to the events the UI components expect (like 'bid:placed')
        if (msg.type === 'bid.placed') {
          triggerEvent('bid:placed', {
            id: `b_${Date.now()}`,
            auctionId: msg.auctionId,
            amount: parseFloat(msg.amount),
            bidderId: msg.bidderId,
            bidderName: `User ${msg.bidderId.substring(0, 4)}`, // Mock username
            timestamp: msg.timestamp
          });
        }
        if (msg.type === 'inventory.update') {
          triggerEvent('inventory:update', msg);
        }
        if (msg.type === 'reservation.confirmed') {
          triggerEvent('reservation:confirmed', msg);
        }
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setConnectionStatus('disconnected');
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, tenantId]);

  const joinAuctionRoom = useCallback(
    (auctionId) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: 'subscribe', auctionId }));
      }
    },
    [socket]
  );

  const leaveAuctionRoom = useCallback(
    (auctionId) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: 'unsubscribe', auctionId }));
      }
    },
    [socket]
  );

  const placeBid = useCallback(
    (auctionId, amount) => {
      return new Promise((resolve, reject) => {
        // Native WS doesn't have a built-in ACK for placeBid like Socket.io
        // Instead, the frontend should use the REST API for placing bids!
        // We will throw an error to fallback to REST API in AuctionRoomPage.jsx
        reject(new Error('Use REST API to place bid'));
      });
    },
    []
  );

  return (
    <SocketContext.Provider
      value={{
        socket: {
          connected: connectionStatus === 'connected',
          on: addListener,
          off: removeListener,
          emit: () => {}
        },
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
