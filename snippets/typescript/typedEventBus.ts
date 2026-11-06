// @codetype hard | Type-safe event bus using mapped types
type EventMap = Record<string, unknown>;
type Handler<T> = (payload: T) => void;

export class EventBus<Events extends EventMap> {
  private handlers: { [K in keyof Events]?: Set<Handler<Events[K]>> } = {};

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>) {
    (this.handlers[event] ??= new Set()).add(handler);
    return () => this.handlers[event]?.delete(handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.handlers[event]?.forEach((handler) => handler(payload));
  }
}

interface AppEvents extends EventMap {
  login: { userId: string };
  logout: undefined;
}

const bus = new EventBus<AppEvents>();
bus.on('login', ({ userId }) => console.log(`Welcome ${userId}`));
bus.emit('login', { userId: 'u_42' });
