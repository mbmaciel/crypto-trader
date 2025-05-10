import React from 'react';

const DerivChartEmbed = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', backgroundColor: '#1e222d' }}>
      <iframe
        title="Gráfico Deriv R_100"
        src="https://charts.deriv.com/?theme=dark&lang=pt&market=synthetic&symbol=R_100&interval=60"
        width="100%"
        height="100%"
        style={{
          border: 'none',
          backgroundColor: '#1e222d'
        }}
        sandbox="allow-same-origin allow-scripts allow-forms"
      />

      {/* Overlay para esconder o botão "Try demo" (posição fixa no canto inferior direito) */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          width: 150,
          height: 40,
          backgroundColor: '#1e222d'
        }}
      />
    </div>
  );
};

export default DerivChartEmbed;
