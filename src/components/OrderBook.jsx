import React, { useEffect, useState } from 'react';

const OrderBook = () => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBids(data.bids.slice(0, 10));
      setAsks(data.asks.slice(0, 10));
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ flex: 1, padding: '1rem', backgroundColor: '#161b22', color: 'white', borderRadius: '8px', marginRight: '1rem' }}>
      <h3>Order Book (BTC/USDT)</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>Bids</strong>
          {bids.map(([price, qty], i) => (
            <div key={i} style={{ color: 'lime' }}>{price} ({qty})</div>
          ))}
        </div>
        <div>
          <strong>Asks</strong>
          {asks.map(([price, qty], i) => (
            <div key={i} style={{ color: 'red' }}>{price} ({qty})</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;

