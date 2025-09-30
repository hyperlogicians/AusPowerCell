type Health = 'good' | 'medium' | 'bad';

type Listener = () => void;

class StatusStore {
  wifiName: string = '';
  systemHealth: Health = 'good';
  private listeners: Set<Listener> = new Set();

  setWifiName(name: string) {
    this.wifiName = name;
    this.emit();
  }

  setHealth(newHealth: Health) {
    this.systemHealth = newHealth;
    this.emit();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }
}

export const statusStore = new StatusStore();


