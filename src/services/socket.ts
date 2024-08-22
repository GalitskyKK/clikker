// socket.ts

export const createWebSocketConnection = (userId: string, type: string): WebSocket => {
  const url = `ws://127.0.0.1:8002/ws/${type}/${userId}`;
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log(`WebSocket connection established: ${url}`);
  };

  socket.onmessage = (event) => {
    console.log(`Message received: ${event.data}`);
    // Обработка сообщения
  };

  socket.onerror = (error) => {
    console.error(`WebSocket error:`, error);
  };

  socket.onclose = (event) => {
    console.log(`WebSocket connection closed: ${event.reason}`);
  };

  return socket;
};
