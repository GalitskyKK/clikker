// services/socket.ts
const SOCKET_URL = 'ws://127.0.0.1:8002/ws';

export const createWebSocketConnection = (userId: string, type: 'coins' | 'energy') => {
  const socket = new WebSocket(`${SOCKET_URL}/${type}_gain/${userId}`);

  socket.onopen = () => {
    console.log('WebSocket connected:', type);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket data:', data);
      // Обработка данных о коинс или энергии
    } catch (error) {
      console.error('Error parsing WebSocket data:', error);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected:', type);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};
