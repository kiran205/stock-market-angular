import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface GexModuleData {
  readonly marketRegime: readonly unknown[];
  readonly marketIntelligence: readonly unknown[];
  readonly momentum: readonly unknown[];
}

@Injectable({ providedIn: 'root' })
export class GexService {
  load(): Observable<GexModuleData> {
    return of({
      marketRegime: [],
      marketIntelligence: [],
      momentum: []
    });
  }
}
