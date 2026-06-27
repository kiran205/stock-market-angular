import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardModuleData } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  load(): Observable<DashboardModuleData> {
    return of({
      nfHeatmap: [],
      marketSummary: {},
      marketBreadth: {}
    });
  }
}
