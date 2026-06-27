export interface StoreLifecycle {
  load(): void;
  refresh(): void;
  connectSocket(): void;
  disconnectSocket(): void;
  handleSocketMessage(message: unknown): void;
  appendRealtimeData(data: unknown): void;
  updateRealtimeData(data: unknown): void;
  clear(): void;
}
