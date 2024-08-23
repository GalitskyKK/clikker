import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [energy, setEnergy] = useState<number>(1000);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<number>(() => {
    const storedUserId = localStorage.getItem('userId');
    return storedUserId ? parseInt(storedUserId, 10) : Math.floor(Math.random() * 10000);
  });

  const isMounted = useRef<boolean>(false);

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
    if (!isMounted.current) return;

    try {
      console.log('Sending POST request with:', { userId, balance, energy });
      await postUserData(userId, balance, energy);
    } catch (error) {
      console.error('Failed to post user data:', error.response?.data || error.message);
    }
  }, [userId, balance, energy]);

  useEffect(() => {
    localStorage.setItem('userId', userId.toString());
    initializeUserData();

    // Устанавливаем флаг монтирования компонента
    isMounted.current = true;

    // Очистка при размонтировании компонента
    return () => {
      isMounted.current = false;
    };
  }, [initializeUserData, userId]);

  useEffect(() => {
    // Обработка события beforeunload для отправки данных при закрытии страницы
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault(); // Стандартный метод отмены действия
      saveUserData(); // Вызываем функцию сохранения данных
      return ''; // Возвращаем пустую строку для совместимости с браузерами
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveUserData]);

  const handleFruitClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (energy > 0) {
      const newBalance = balance + 1;
      const newEnergy = energy - 1;

      setBalance(newBalance);
      setEnergy(newEnergy);

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
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 1000));
    }, 1000);

    return () => clearInterval(energyRegenInterval);
  }, []);

  useEffect(() => {
    const autoFarmInterval = setInterval(() => {
      setBalance((prevBalance) => prevBalance + 1);
    }, 1000);

    return () => clearInterval(autoFarmInterval);
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
        <div className="energy-bar" style={{ width: `${energy / 10}%` }}>
          {energy}
        </div>
      </div>
    </div>
  );
};

export default App;
