import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { WebSocketService } from '@core/services/web-socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  private readonly webSocketService = inject(WebSocketService);

  constructor() {
    this.themeService.initialize();
    this.webSocketService.connect();
  }
}
