import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TradeData } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {

  constructor() { }

  private tradeDataSubject = new BehaviorSubject<TradeData | null>(null);
  tradeData$ = this.tradeDataSubject.asObservable();

  updateTradeData(newTradeData: TradeData): void {
    this.tradeDataSubject.next(newTradeData);
  }

}
