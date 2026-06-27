import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-coming-soon-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  template: `
    <app-page-header
      [title]="page().title"
      [description]="page().description"
      [icon]="page().icon"
      eyebrow="Feature Shell"
    />
    <app-coming-soon [title]="page().title" [description]="page().description" [icon]="page().icon" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComingSoonPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, { initialValue: {} });

  readonly page = computed(() => {
    const data = this.routeData() as { title?: unknown; description?: unknown; icon?: unknown };

    return {
      title: String(data.title ?? 'Coming Soon'),
      description: String(data.description ?? 'Module structure completed. Business implementation coming soon.'),
      icon: String(data.icon ?? 'insights')
    };
  });
}
