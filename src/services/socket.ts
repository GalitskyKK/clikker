export class WebSocketService {
  private coinSocket: WebSocket | null = null;
  private energySocket: WebSocket | null = null;
  private userId: number;

  constructor(userId: number) {
    this.userId = userId;
    this.initSockets();
  }

  private initSockets() {
    try {
      // Создайте WebSocket соединения
      this.coinSocket = new WebSocket(`ws://127.0.0.1:8002/ws/coins_gain/${this.userId}/`);
      this.energySocket = new WebSocket(`ws://127.0.0.1:8002/ws/energy_gain/${this.userId}/`);

      this.coinSocket.onopen = () => {
        console.log('Connected to WebSocket for coins');
      };

      this.energySocket.onopen = () => {
        console.log('Connected to WebSocket for energy');
      };

      this.coinSocket.onmessage = (event) => {
        console.log('Received coin data:', event.data);
      };

      this.energySocket.onmessage = (event) => {
        console.log('Received energy data:', event.data);
      };

      this.coinSocket.onerror = (error) => {
        console.error('WebSocket error for coins:', error);
      };

      this.energySocket.onerror = (error) => {
        console.error('WebSocket error for energy:', error);
      };

      this.coinSocket.onclose = (event) => {
        console.log('WebSocket for coins closed', event);
      };

      this.energySocket.onclose = (event) => {
        console.log('WebSocket for energy closed', event);
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
    }
  }

  public sendCoinsUpdate(coins: number) {
    if (this.coinSocket && this.coinSocket.readyState === WebSocket.OPEN) {
      this.coinSocket.send(JSON.stringify({ coins: coins.toString() }));
    } else {
      console.warn('Coin WebSocket is not open. Skipping update.');
    }
  }

  public sendEnergyUpdate(energy: number) {
    if (this.energySocket && this.energySocket.readyState === WebSocket.OPEN) {
      this.energySocket.send(JSON.stringify({ energy: energy.toString() }));
    } else {
      console.warn('Energy WebSocket is not open. Skipping update.');
    }
  }

  public closeConnections() {
    if (this.coinSocket) this.coinSocket.close();
    if (this.energySocket) this.energySocket.close();
  }
}
