import { Injectable } from '@angular/core';
import { StockTradeService } from './stock-trade.service';
import { TradeData } from '../types';
import { Observable, switchMap, of, concatMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StockCacheService {

  constructor(private stockTradeService: StockTradeService) { }


  loadDataFromCache(stock: string): Observable<TradeData> {
    const cachedData = sessionStorage.getItem(`tradeData_${stock}`);
    if (cachedData) {
      const tradeData: TradeData = JSON.parse(cachedData);
      return of(tradeData);
    } else {
      return this.stockTradeService.loadTradingData(stock).pipe(
        concatMap((returnedData: TradeData) => {
          sessionStorage.setItem(`tradeData_${stock}`, JSON.stringify(returnedData));
          return of(returnedData);
        })
      );
    }
  }
}
