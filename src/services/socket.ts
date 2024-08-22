// services/socket.ts
const SOCKET_URL = 'ws://127.0.0.1:8002/ws'; // Адрес вашего WebSocket-сервера

export const createWebSocketConnection = () => {
  const socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket data:', data);
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };

  return socket;
};
