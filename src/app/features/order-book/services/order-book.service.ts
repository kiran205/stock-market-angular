import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface OrderBookModuleData {
  readonly marketStructure: readonly unknown[];
  readonly orderFlow: readonly unknown[];
}

@Injectable({ providedIn: 'root' })
export class OrderBookService {
  load(): Observable<OrderBookModuleData> {
    return of({
      marketStructure: [],
      orderFlow: []
    });
  }
}
