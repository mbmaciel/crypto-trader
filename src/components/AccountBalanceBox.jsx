import React from 'react';
import { useAuth } from '../context/AuthProvider';

const AccountBalanceBox = () => {
  const { balance, isAuthorized } = useAuth();

  return (
    <div style={{ background: '#161b22', padding: '1rem', color: 'white', borderRadius: '8px' }}>
      <h2>🔐 Conta Deriv</h2>
      <p>Status: {isAuthorized ? '✅ Autenticado' : '🔒 Não autenticado'}</p>
      <h3>💰 Saldo: {balance !== null ? `$${balance}` : 'Carregando...'}</h3>
    </div>
  );
};

export default AccountBalanceBox;
