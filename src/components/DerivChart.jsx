import React from 'react';
import { Chart, ChartType } from '@deriv/deriv-charts';
import '@deriv/deriv-charts/dist/deriv-charts.css';

const DerivChart = () => {
  return (
    <div style={{ height: '600px', width: '100%' }}>
      <Chart
        symbol="R_100"
        chartType={ChartType.Candle}
        granularity={60} // 1 minuto
        startEpoch={Math.floor(Date.now() / 1000) - 3600} // últimos 60 minutos
        endEpoch="latest"
        settings={{
          language: 'pt',
          position: 'top',
          isHighestLowestMarkerEnabled: true,
        }}
      />
    </div>
  );
};

export default DerivChart;
