const BASE_URL = 'ws://127.0.0.1:8002/ws/'; // Замените на ваш фактический URL

type WebSocketType = 'coins_gain' | 'energy_gain';

interface WebSocketHandlers {
  onMessage: (data: any) => void;
  onError: (error: Event | string) => void;
  onClose: (event: CloseEvent) => void;
}

const isJSON = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const activeSockets: Record<string, WebSocket | null> = {
  coins_gain: null,
  energy_gain: null,
};

const connectToWebSocket = (userId: number, type: WebSocketType, handlers: WebSocketHandlers) => {
  const url = `${BASE_URL}${type}/${userId}/`;

  if (activeSockets[type]) {
    console.warn(`${type} WebSocket already connected, not creating a new one.`);
    return;
  }

  const createWebSocket = () => {
    const ws = new WebSocket(url);
    activeSockets[type] = ws;

    ws.onopen = () => {
      console.log(`${type} WebSocket connected`);
    };

    ws.onmessage = (event) => {
      console.log(`${type} WebSocket message received:`, event.data); // Выводим сырые данные
      if (isJSON(event.data)) {
        try {
          const data = JSON.parse(event.data);
          handlers.onMessage(data);
        } catch (error) {
          console.error(`${type} WebSocket message parsing error:`, error, event.data);
          handlers.onError('WebSocket message parsing error: ' + (error as Error).message);
        }
      } else {
        console.warn(`${type} Non-JSON message received:`, event.data);
        handlers.onError(`Non-JSON message received: ${event.data}`);
      }
    };

    ws.onerror = (error) => {
      console.error(`${type} WebSocket error`, error);
      handlers.onError(error);
    };

    ws.onclose = (event) => {
      console.warn(`${type} WebSocket closed`, event);
      handlers.onClose(event);
      activeSockets[type] = null; // Reset socket on close
      // Reconnect after a delay
      setTimeout(createWebSocket, 5000);
    };
  };

  createWebSocket();
};

export { connectToWebSocket };
