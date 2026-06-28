import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  DashboardModuleData,
  SupportResistanceRequest,
  SupportResistanceResponse
} from '../models/dashboard.models';

const SUPPORT_RESISTANCE_URL = 'https://asia-south1-stock-anaysis.cloudfunctions.net/support-resistance';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  load(): Observable<DashboardModuleData> {
    return of({
      nfHeatmap: [],
      marketSummary: {},
      marketBreadth: {}
    });
  }

  analyzeSupportResistance(payload: SupportResistanceRequest): Observable<SupportResistanceResponse> {
    return this.http.post<SupportResistanceResponse>(SUPPORT_RESISTANCE_URL, payload);
  }
}
