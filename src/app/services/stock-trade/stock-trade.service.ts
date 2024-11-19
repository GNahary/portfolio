import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ALPHA_KEY } from '../../../keys';
import { TradeData } from '../../../types';



@Injectable({
  providedIn: 'root'
})
export class StockTradeService {

  constructor(private http: HttpClient) { }


  loadTradingData(stockSymbol: String): Observable<TradeData> {

    const apiUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY'
      + `&symbol=${stockSymbol}`
      + `&apikey=${ALPHA_KEY}`;

    return this.http.get<any>(apiUrl).pipe(
      map((response) => {
        const timeSeries = response['Weekly Time Series'];

        // Extract trade times (keys) and trade prices ("4. close" values)
        const tradeTimes = Object.keys(timeSeries);
        const tradePrice = tradeTimes.map((time) => parseFloat(timeSeries[time]['4. close']));

        // Get the last price (most recent time)
        const lastPrice = tradePrice[0]; // Assuming the first key is the most recent

        return {
          stockSymbol,
          tradeTimes,
          tradePrice,
          lastPrice,
        } as TradeData;
      })
    );

  }

}
