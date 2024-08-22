import React, { useState, useEffect } from 'react';
import './styles/main.scss';
import fruit from './assets/fruit.png';
import coin from './assets/coin.png';
import { getInitialData, updateBalanceAndEnergy } from './services/api';
import { createWebSocketConnection } from './services/socket';

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
}

const App: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(100);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

  useEffect(() => {
    // Загружаем начальные данные с сервера
    getInitialData().then((data) => {
      setBalance(data.balance);
      setEnergy(data.energy);
    });

    // Устанавливаем WebSocket-соединение
    const socket = createWebSocketConnection();

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBalance(data.balance);
      setEnergy(data.energy);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleFruitClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy > 0) {
      const newBalance = balance + 1;
      const newEnergy = energy - 1;

      setBalance(newBalance);
      setEnergy(newEnergy);

      // Обновляем данные на сервере
      await updateBalanceAndEnergy(newBalance, newEnergy);

      const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
      const y = e.clientY - e.currentTarget.getBoundingClientRect().top;

      const newNumber: FloatingNumber = {
        id: Date.now(),
        value: 1, // +1 за клик
        x,
        y,
      };

      setFloatingNumbers([...floatingNumbers, newNumber]);

      setTimeout(() => {
        setFloatingNumbers((prevNumbers) =>
          prevNumbers.filter((number) => number.id !== newNumber.id),
        );
      }, 1500); // Убираем через 1.5 секунды
    }
  };

  useEffect(() => {
    const energyRegenInterval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 100));
    }, 1000); // Восстанавливаем энергию каждую секунду

    return () => clearInterval(energyRegenInterval);
  }, []);

  return (
    <div className="app-container">
      <div className="balance">
        <img className="coin" src={coin} alt="Coin" />
        {balance.toLocaleString()}
      </div>
      <div className="fruit-container">
        {floatingNumbers.map((number) => (
          <div
            key={number.id}
            className="floating-number"
            style={{ left: number.x, top: number.y }}>
            +{number.value}
          </div>
        ))}
        <img className="fruit" src={fruit} onClick={handleFruitClick} alt="Berry" />
      </div>
      <div className="energy">
        <div className="energy-bar" style={{ width: `${energy}%` }}>
          {energy}
        </div>
      </div>
    </div>
  );
};

export default App;
