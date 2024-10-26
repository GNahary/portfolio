import { Injectable } from '@angular/core';
import { StockTradeService } from './stock-trade.service';
import { TradeData } from '../types';
import { Observable, of, concatMap } from 'rxjs';

export interface CachedTradeData {
  cacheDate: Date,
  tradeData: TradeData
}

@Injectable({
  providedIn: 'root'
})
export class StockCacheService {

  constructor(private stockTradeService: StockTradeService) { }


    loadDataFromCache(stock: string): Observable<TradeData> {
      const cachedObject = sessionStorage.getItem(`cachedTradeData_${stock}`);
      if (cachedObject) {
        const cachedTradeData: CachedTradeData = JSON.parse(cachedObject);
        cachedTradeData.cacheDate = new Date(cachedTradeData.cacheDate);
        if (cachedTradeData.cacheDate.getDate() <  this.getTodayAtMidnightUTC().getDate()) {
          console.log(`Stale cache. Querying data for ${stock}.`);
          return this.loadData(stock);
        } else {
          console.log(`Data for ${stock} already in cache`);
          return of(cachedTradeData.tradeData);
        }
        
      } else {
        console.log(`Cache miss. Querying data for ${stock}.`);
        return this.loadData(stock);
      }
    }


  private loadData(stock: string): Observable<TradeData> {
    return this.stockTradeService.loadTradingData(stock).pipe(
      concatMap((returnedData: TradeData) => {

        let cachedStockData = {
          cacheDate: this.getTodayAtMidnightUTC(),
          tradeData: returnedData
        }

        sessionStorage.setItem(`cachedTradeData_${stock}`, JSON.stringify(cachedStockData));
        return of(returnedData);
      })
    );

  }

  private getTodayAtMidnightUTC():Date{
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }
}
