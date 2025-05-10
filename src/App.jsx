import React from 'react';
import TradingChart from './components/TradingChart';
import LivePriceChart from './components/LivePriceChart';
import OrderBook from './components/OrderBook';
import VolumeChart from './components/VolumeChart';
import LivePriceDeriv from './components/LivePriceDeriv';
import DerivChart from './components/DerivChart';
//import DerivCandlestickChart from './components/DerivCandlestickChart';

function App() {
  return (
    <div style={{ backgroundColor: '#0e1117', color: 'white', padding: '2rem' }}>
      <h1>📊 Crypto Trade Dashboard</h1>
      <LivePriceDeriv />
      <DerivChart />
      <div style={{ display: 'flex', marginBottom: '2rem' }}>
        <OrderBook />
        <VolumeChart />
      </div>
      <TradingChart />
    </div>
  );
}

export default App;

