import { Injectable, computed, signal } from '@angular/core';
import { WebSocketConnectionState } from '@core/models/web-socket.model';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private readonly connectionState = signal<WebSocketConnectionState>('disconnected');

  readonly state = computed(() => this.connectionState());
  readonly label = computed(() => {
    const state = this.connectionState();
    return state.charAt(0).toUpperCase() + state.slice(1);
  });

  connect(): void {
    this.connectionState.set('reconnecting');
    window.setTimeout(() => this.connectionState.set('connected'), 900);
  }

  disconnect(): void {
    this.connectionState.set('disconnected');
  }
}
