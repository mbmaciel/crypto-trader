import React, { useEffect, useState } from 'react';

const LivePrice = () => {
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.c).toFixed(2)); // c = current close price
      setChange(parseFloat(data.P).toFixed(2)); // P = price change percent
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{
      padding: '1rem',
      marginBottom: '1rem',
      background: '#161b22',
      borderRadius: '8px',
      color: change > 0 ? 'lime' : 'red'
    }}>
      <h2>BTC/USDT</h2>
      <h3>${price}</h3>
      <p>{change}%</p>
    </div>
  );
};

export default LivePrice;

