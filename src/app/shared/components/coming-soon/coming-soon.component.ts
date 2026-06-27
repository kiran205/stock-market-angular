import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <section class="coming-soon app-card fade-in">
      <div class="orbital">
        <span></span>
        <span></span>
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <p>Enterprise module scaffold</p>
      <h2>{{ title() }}</h2>
      <span class="description">{{ description() }}</span>
      <div class="signal-bars" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </section>
  `,
  styles: [`
    .coming-soon {
      display: grid;
      width: min(100%, 720px);
      min-height: 460px;
      place-items: center;
      margin: 32px auto;
      padding: clamp(28px, 5vw, 64px);
      overflow: hidden;
      position: relative;
      text-align: center;
    }

    .coming-soon::before {
      content: '';
      position: absolute;
      inset: -30% 15% auto;
      height: 280px;
      background: radial-gradient(circle, color-mix(in srgb, var(--app-primary) 30%, transparent), transparent 68%);
      filter: blur(10px);
    }

    .orbital {
      display: grid;
      width: 132px;
      height: 132px;
      place-items: center;
      position: relative;
      margin-bottom: 28px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--app-primary) 12%, transparent);
      color: var(--app-primary);
    }

    .orbital span {
      position: absolute;
      inset: 8px;
      border: 1px solid color-mix(in srgb, var(--app-primary) 42%, transparent);
      border-radius: 50%;
      animation: orbit 4s linear infinite;
    }

    .orbital span:nth-child(2) {
      inset: 22px;
      animation-duration: 6s;
      animation-direction: reverse;
    }

    mat-icon {
      width: 56px;
      height: 56px;
      font-size: 56px;
      z-index: 1;
    }

    p {
      margin: 0 0 8px;
      color: var(--app-primary);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    h2 {
      margin: 0;
      font-size: clamp(30px, 5vw, 52px);
      letter-spacing: -0.05em;
    }

    .description {
      max-width: 460px;
      margin-top: 12px;
      color: var(--app-muted);
      font-size: 16px;
      line-height: 1.7;
    }

    .signal-bars {
      display: flex;
      gap: 8px;
      align-items: end;
      height: 58px;
      margin-top: 32px;
    }

    .signal-bars i {
      width: 10px;
      border-radius: 999px;
      background: linear-gradient(var(--app-primary), var(--app-success));
      animation: pulse-bar 1.2s ease-in-out infinite;
    }

    .signal-bars i:nth-child(1) { height: 22px; }
    .signal-bars i:nth-child(2) { height: 40px; animation-delay: 120ms; }
    .signal-bars i:nth-child(3) { height: 58px; animation-delay: 240ms; }
    .signal-bars i:nth-child(4) { height: 34px; animation-delay: 360ms; }
    .signal-bars i:nth-child(5) { height: 48px; animation-delay: 480ms; }

    @keyframes orbit {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes pulse-bar {
      50% {
        transform: scaleY(0.55);
        opacity: 0.55;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComingSoonComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input('insights');
}
