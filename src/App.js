import React from 'react';
import DerivChartEmbed from './components/DerivChartEmbed';

function App() {
  return (
    <div style={{ backgroundColor: '#1e222d', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Gráfico Deriv - R_100</h1>
      <DerivChartEmbed />
    </div>
  );
}

export default App;
