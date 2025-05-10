import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const VolumeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let volume = 0;
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      volume += parseFloat(trade.q); // quantity of the trade
    };

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      setData(prev => {
        const updated = [...prev.slice(-29), { time, volume: volume.toFixed(2) }];
        return updated;
      });
      volume = 0;
    }, 1000);

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, []);

  return (
    <div style={{ flex: 1, padding: '1rem', backgroundColor: '#161b22', color: 'white', borderRadius: '8px' }}>
      <h3>Live Trade Volume</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="time" tick={{ fill: '#ccc' }} />
          <YAxis tick={{ fill: '#ccc' }} />
          <Tooltip />
          <Bar dataKey="volume" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;

