import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Nifty50ModuleData {
  readonly intelTimeline: readonly unknown[];
  readonly sectorIntelligence: readonly unknown[];
  readonly weightageMatrix: readonly unknown[];
}

@Injectable({ providedIn: 'root' })
export class Nifty50Service {
  load(): Observable<Nifty50ModuleData> {
    return of({
      intelTimeline: [],
      sectorIntelligence: [],
      weightageMatrix: []
    });
  }
}
