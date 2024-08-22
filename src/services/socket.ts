const SOCKET_URL = 'ws://127.0.0.1:8002/ws';

const generateUserId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('userId', userId);
  }
  return userId;
};

const userId = getUserId();

export const createWebSocketConnection = () => {
  const socket = new WebSocket(`${SOCKET_URL}?userId=${userId}`);

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
