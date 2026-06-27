import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AdminStore } from '../stores/admin.store';

@Component({
  selector: 'app-audit-logs-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './audit-logs.page.html',
  styleUrl: './audit-logs.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogsPageComponent {
  readonly store = inject(AdminStore);

  constructor() {
    this.store.load();
  }
}
