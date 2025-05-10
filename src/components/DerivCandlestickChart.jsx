import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const DerivCandlestickChart = () => {
  const chartContainerRef = useRef();
  const candleSeriesRef = useRef();
  const wsRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#0e1117' },
        textColor: '#ffffff',
      },
      grid: {
        vertLines: { color: '#1e2229' },
        horzLines: { color: '#1e2229' },
      },
      timeScale: { timeVisible: true },
    });

    const candleSeries = chart.addSeries('Candlestick', {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    candleSeriesRef.current = candleSeries;

    const ws = new WebSocket('wss://ws.derivws.com/websockets/v3');
    wsRef.current = ws;

    ws.onopen = () => {
      // Solicita histórico de candles (últimos 100 candles de 1 minuto)
      ws.send(JSON.stringify({
        candles: 'R_100',
        count: 100,
        granularity: 60,
      }));
      // Inscreve-se para receber atualizações em tempo real
      ws.send(JSON.stringify({
        ohlc: 1,
        subscribe: 1,
        ticks_history: 'R_100',
        style: 'candles',
        granularity: 60,
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.msg_type === 'candles') {
        const formatted = data.candles.map(c => ({
          time: c.epoch,
          open: parseFloat(c.open),
          high: parseFloat(c.high),
          low: parseFloat(c.low),
          close: parseFloat(c.close),
        }));
        candleSeries.setData(formatted);
      }

      if (data.msg_type === 'ohlc') {
        const c = data.ohlc;
        candleSeries.update({
          time: c.open_time,
          open: parseFloat(c.open),
          high: parseFloat(c.high),
          low: parseFloat(c.low),
          close: parseFloat(c.close),
        });
      }
    };

    return () => ws.close();
  }, []);

  return <div ref={chartContainerRef} style={{ width: '100%', marginBottom: '2rem' }} />;
};

export default DerivCandlestickChart;
