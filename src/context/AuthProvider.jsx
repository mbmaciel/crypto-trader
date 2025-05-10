import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [balance, setBalance] = useState(null);

  const token = import.meta.env.VITE_DERIV_TOKEN; // Add this to your .env file

  useEffect(() => {
    const socket = new WebSocket('wss://ws.derivws.com/websockets/v3');

    socket.onopen = () => {
      socket.send(JSON.stringify({ authorize: token }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.msg_type === 'authorize') {
        setIsAuthorized(true);
        socket.send(JSON.stringify({ balance: 1 }));
      }

      if (data.msg_type === 'balance') {
        setBalance(data.balance.balance);
      }
    };

    setWs(socket);

    return () => socket.close();
  }, [token]);

  const value = {
    ws,
    isAuthorized,
    balance,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
