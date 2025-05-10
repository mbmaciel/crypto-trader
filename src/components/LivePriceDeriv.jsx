import React, { useEffect, useState } from 'react';

const LivePriceDeriv = () => {
  const [price, setPrice] = useState(null);
  const [symbol, setSymbol] = useState('R_100'); // símbolo padrão da Deriv

  useEffect(() => {
    const ws = new WebSocket('wss://ws.derivws.com/websockets/v3');

    ws.onopen = () => {
      // Não precisa de token para tick público
      ws.send(JSON.stringify({ ticks: symbol }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.msg_type === 'tick') {
        setPrice(data.tick.quote);
      }
    };

    return () => ws.close();
  }, [symbol]);

  return (
    <div style={{
      background: '#161b22',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      color: 'white'
    }}>
      <h2>📈 Ativo: {symbol}</h2>
      <h3>Preço Atual: {price ? price.toFixed(2) : 'Carregando...'}</h3>
    </div>
  );
};

export default LivePriceDeriv;
