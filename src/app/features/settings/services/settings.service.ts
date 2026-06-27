import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SettingsModuleData {
  readonly preferences: Record<string, unknown>;
  readonly integrations: readonly unknown[];
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  load(): Observable<SettingsModuleData> {
    return of({
      preferences: {},
      integrations: []
    });
  }
}
