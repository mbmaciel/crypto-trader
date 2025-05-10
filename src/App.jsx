import React from 'react';
import DerivChart from './components/DerivChart';

function App() {
  return (
    <div style={{ backgroundColor: '#1e222d', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Gráfico Deriv - R_100</h1>
      <DerivChart />
    </div>
  );
}

export default App;
