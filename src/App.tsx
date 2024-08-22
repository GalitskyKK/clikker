import React, { useState, useEffect, useCallback } from 'react';
import { fetchUserData, postUserData } from './services/api';
import './styles/main.scss';
import fruit from './assets/fruit.png';
import coin from './assets/coin.png';

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
  const [userId] = useState<number>(Math.floor(Math.random() * 10000)); // Генерация userId

  const initializeUserData = useCallback(async () => {
    try {
      const { coins, energy } = await fetchUserData(userId);
      setBalance(coins);
      setEnergy(energy);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [userId]);

  const saveUserData = useCallback(async () => {
    try {
      await postUserData(userId, balance, energy);
    } catch (error) {
      console.error('Failed to post user data:', error);
    }
  }, [userId]);

  useEffect(() => {
    initializeUserData();

    return () => {
      saveUserData();
    };
  }, [initializeUserData, saveUserData]);

  const handleFruitClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy > 0) {
      const newBalance = balance + 1;
      const newEnergy = energy - 1;

      setBalance(newBalance);
      setEnergy(newEnergy);

      const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
      const y = e.clientY - e.currentTarget.getBoundingClientRect().top;

      const newNumber: FloatingNumber = {
        id: Date.now(),
        value: 1,
        x,
        y,
      };

      setFloatingNumbers([...floatingNumbers, newNumber]);

      setTimeout(() => {
        setFloatingNumbers((prevNumbers) =>
          prevNumbers.filter((number) => number.id !== newNumber.id),
        );
      }, 1500);
    }
  };

  useEffect(() => {
    const energyRegenInterval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 1000));
    }, 1000);

    return () => clearInterval(energyRegenInterval);
  }, []);

  return (
    <div className="app-container">
      <div className="balance">
        <img className="coin" src={coin} />
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
        <div className="energy-bar" style={{ width: `${energy / 10}%` }}>
          {energy}
        </div>
      </div>
    </div>
  );
};

export default App;
