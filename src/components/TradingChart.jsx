import React, { useState, useEffect, useRef } from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TradingChart = () => {
  const [symbol, setSymbol] = useState('BINANCE:BTCUSDT');
  const [showTradingView, setShowTradingView] = useState(true);
  const [derivData, setDerivData] = useState({ labels: [], prices: [] });
  const wsRef = useRef(null);
  
  // Função para limpar e desconectar websocket
  const cleanupWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  };
  
  // Conectar ao WebSocket da Deriv quando necessário
  useEffect(() => {
    if (symbol === 'R_100') {
      setShowTradingView(false);
      
      // Limpar dados anteriores
      setDerivData({ labels: [], prices: [] });
      cleanupWebSocket();
      
      // Conectar ao WebSocket com app_id
      const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
      wsRef.current = ws;
      
      ws.onopen = () => {
        // Envio correto da solicitação de tick com subscribe
        ws.send(JSON.stringify({ ticks: 'R_100', subscribe: 1 }));
      };
      
      ws.onerror = (err) => {
        console.error("Erro no WebSocket Deriv", err);
      };
      
      ws.onclose = () => {
        console.info("WebSocket Deriv fechado.");
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.msg_type === 'tick') {
          const tick = data.tick;
          // Garante dados definidos antes de atualizar tela
          if (tick && tick.epoch && tick.quote !== undefined) {
            const time = new Date(tick.epoch * 1000).toLocaleTimeString();
            const price = tick.quote;
            
            setDerivData(prevData => ({
              labels: [...prevData.labels, time].slice(-30), // Manter apenas os últimos 30 pontos
              prices: [...prevData.prices, price].slice(-30)
            }));
          }
        }
      };
      
      // Cleanup sempre na troca de símbolo ou desmontagem
      return () => {
        cleanupWebSocket();
      };
    } else {
      setShowTradingView(true);
      setDerivData({ labels: [], prices: [] }); // Limpa gráfico anterior da Deriv
      cleanupWebSocket();
    }
  }, [symbol]);
  
  const chartData = {
    labels: derivData.labels,
    datasets: [
      {
        label: 'R_100 Preço',
        data: derivData.prices,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.2,
        pointRadius: 2,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    },
    plugins: {
      legend: {
        labels: { color: 'white' }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    animation: {
      duration: 0 // Desativar animações para melhor desempenho
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={() => setSymbol('BINANCE:BTCUSDT')} 
          className={symbol === 'BINANCE:BTCUSDT' ? 'active' : ''}
          style={{ 
            marginRight: '10px', 
            padding: '5px 10px',
            backgroundColor: symbol === 'BINANCE:BTCUSDT' ? '#4caf50' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          BTC/USDT
        </button>
        <button 
          onClick={() => setSymbol('R_100')} 
          className={symbol === 'R_100' ? 'active' : ''}
          style={{ 
            padding: '5px 10px',
            backgroundColor: symbol === 'R_100' ? '#4caf50' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          R_100 (Deriv)
        </button>
      </div>
      
      <div style={{ height: '600px', width: '100%', background: '#1e222d' }}>
        {showTradingView ? (
          <TradingViewWidget
            symbol={symbol}
            theme="dark"
            locale="pt"
            autosize
            studies={['RSI', 'MACD']}
            interval="1"
            timezone="America/Sao_Paulo"
          />
        ) : (
          <div style={{ height: '100%', padding: '20px' }}>
            <Line data={chartData} options={chartOptions} />
            {derivData.prices.length === 0 && (
              <div style={{ color: '#aaa', textAlign: 'center', marginTop: 40 }}>
                Aguardando dados ao vivo da Deriv...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingChart;
