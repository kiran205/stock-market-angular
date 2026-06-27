import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface AdminModuleData {
  readonly users: readonly unknown[];
  readonly roles: readonly unknown[];
  readonly auditLogs: readonly unknown[];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  load(): Observable<AdminModuleData> {
    return of({
      users: [],
      roles: [],
      auditLogs: []
    });
  }
}
