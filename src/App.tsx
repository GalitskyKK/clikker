// App.tsx
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
  const generateUserId = (): string => {
    const userId = Date.now().toString();
    localStorage.setItem('userId', userId);
    return userId;
  };

  const [userId, setUserId] = useState<string>(localStorage.getItem('userId') || generateUserId());
  const [balance, setBalance] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(100);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInitialData(userId);
        setBalance(data.coins);
        setEnergy(data.energy);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };

    fetchData();

    const coinsSocket = createWebSocketConnection(userId, 'coins');
    const energySocket = createWebSocketConnection(userId, 'energy');

    coinsSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.coins) {
        setBalance(parseFloat(data.coins));
      }
    };

    energySocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.energy) {
        setEnergy(parseFloat(data.energy));
      }
    };

    return () => {
      coinsSocket.close();
      energySocket.close();
    };
  }, [userId]);

  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      event.preventDefault();
      try {
        await updateBalanceAndEnergy(userId, balance, energy);
      } catch (error) {
        console.error('Failed to update balance and energy:', error);
      }
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [balance, energy, userId]);

  const handleFruitClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (energy > 0) {
      const newBalance = balance + 1;
      const newEnergy = energy - 1;

      setBalance(newBalance);
      setEnergy(newEnergy);

      try {
        await updateBalanceAndEnergy(userId, newBalance, newEnergy);
      } catch (error) {
        console.error('Failed to update balance and energy:', error);
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newNumber: FloatingNumber = {
        id: Date.now(),
        value: 1,
        x,
        y,
      };

      setFloatingNumbers((prevNumbers) => [...prevNumbers, newNumber]);

      setTimeout(() => {
        setFloatingNumbers((prevNumbers) =>
          prevNumbers.filter((number) => number.id !== newNumber.id),
        );
      }, 1500);
    }
  };

  useEffect(() => {
    const energyRegenInterval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 100));
    }, 1000);

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
        <div className="energy-bar" style={{ width: `${Math.min(energy / 10, 100)}%` }}>
          {energy}
        </div>
      </div>
    </div>
  );
};

export default App;
