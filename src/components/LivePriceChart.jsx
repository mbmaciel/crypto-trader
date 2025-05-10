import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LivePriceChart = () => {
  const [data, setData] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    wsRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const newPrice = parseFloat(msg.c).toFixed(2);
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        price: parseFloat(newPrice),
      };

      setData(prev => {
        const updated = [...prev.slice(-29), newPoint]; // Keep max 30 points
        return updated;
      });
    };

    return () => wsRef.current?.close();
  }, []);

  return (
    <div style={{ background: '#161b22', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
      <h2>📈 BTC/USDT Live Price Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: '#ccc' }} />
          <YAxis tick={{ fill: '#ccc' }} domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#82ca9d" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LivePriceChart;

