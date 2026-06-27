import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="skeleton app-card" aria-label="Loading content">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `,
  styles: [`
    .skeleton {
      display: grid;
      gap: 14px;
      padding: 24px;
    }

    span {
      display: block;
      height: 18px;
      border-radius: 999px;
      background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--app-primary) 20%, transparent), transparent);
      background-size: 240% 100%;
      animation: shimmer 1.4s infinite;
    }

    span:nth-child(2) {
      width: 74%;
    }

    span:nth-child(3) {
      width: 52%;
    }

    @keyframes shimmer {
      to {
        background-position: -240% 0;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSkeletonComponent {}
