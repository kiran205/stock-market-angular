import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AdminStore } from '../stores/admin.store';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './users.page.html',
  styleUrl: './users.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPageComponent {
  readonly store = inject(AdminStore);

  constructor() {
    this.store.load();
  }
}
