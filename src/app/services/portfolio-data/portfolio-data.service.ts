import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TradeData } from '../../../types';
import { AbstractControl, FormArray } from '@angular/forms';
import { StockCacheService } from '../stock-cache/stock-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {

  private tradeData: TradeData | null = null;
  totalAddedFunds: number = 0;
  totalRetrievedFunds: number = 0;
  private tradeDataSubject = new BehaviorSubject<TradeData | null>(null);
  tradeData$ = this.tradeDataSubject.asObservable();


  constructor(private stockCacheService: StockCacheService) { }

  calculatePortfolio(stocks: FormArray) {
    this.tradeData = null;

    stocks.controls.forEach(stock => {
      let stockSymbol: string = stock.get("symbol")?.value;

      if (stockSymbol) {
        this.stockCacheService.loadDataFromCache(stockSymbol).subscribe(

          returnedData => {
            let stockTradeData = this.calcStockPerformance(stock, returnedData);
            this.aggregateData(stockTradeData!);
          },
          err => { alert(`Couldn't find data for ${stockSymbol}, please check validity of symbol`) }
        );

      }
    });

    this.updateTradeData(this.tradeData!!);
  }

  private updateTradeData(newTradeData: TradeData): void {
    this.tradeDataSubject.next(newTradeData);
  }


  private calcStockPerformance(stock: AbstractControl, data: TradeData): TradeData {
    this.totalAddedFunds = 0;
    this.totalRetrievedFunds = 0;

    let stockUnits: number = stock.get("qty")?.value as number;
    let stockPurchaseDate: string = stock.get<string>("purchaseDate")?.value;
    let stockSellDate: string = stock.get<string>("sellDate")?.value;

    this.adjustHoldingPeriod(data, stockSellDate, stockPurchaseDate);
    this.calcTotalHoldingValue(stockUnits, data);
    this.aggregateOverallStockPerformance(stockUnits, data);
    return data;
  }


  private adjustHoldingPeriod(data: TradeData, stockSellDate: string, stockPurchaseDate: string) {

    let sellDateIndex = data.tradeTimes.findIndex((date: string) => (date === stockSellDate || date <= stockSellDate));
    if (sellDateIndex !== -1) {
      data.tradeTimes.splice(0, sellDateIndex);
      data.tradePrice.splice(0, sellDateIndex);
    }

    let purchaseDateIndex = data.tradeTimes.findIndex((date: string) => (date === stockPurchaseDate || date <= stockPurchaseDate));
    if (purchaseDateIndex !== -1) {
      data.tradeTimes.splice(purchaseDateIndex, data.tradeTimes.length - 1);
      data.tradePrice.splice(purchaseDateIndex, data.tradeTimes.length - 1);
    }
  }


  private aggregateOverallStockPerformance(stockUnits: number, data: TradeData) {
    let factor = stockUnits > 1 ? stockUnits : 1;

    this.totalRetrievedFunds += data.lastPrice * factor;

    let addedFundsIndex = data.tradePrice.length - 1;
    for (; addedFundsIndex > 0; addedFundsIndex--) {
      let tradePrice = data.tradePrice[addedFundsIndex];
      if (tradePrice) {
        this.totalAddedFunds += tradePrice * factor;
        break;
      }
    }
  }


  private calcTotalHoldingValue(stockUnits: number, data: TradeData) {

    let holdingStartDate = new Date(data.tradeTimes[data.tradeTimes.length - 1]);
    let holdingEndDate = new Date(data.tradeTimes[0]);
    let fullDateRange = this.generateDateRange(holdingStartDate, holdingEndDate).reverse();
    let fullTradePriceRange: number[] = new Array<number>(fullDateRange.length);
    let factor = stockUnits > 1 ? stockUnits : 1;
    let fullDateRangeIndex = 0;

    for (let index = 0; index < data.tradePrice.length; index++) {
      let stockValue = data.tradePrice[index] * factor;

      // fill with the right price
      while (fullDateRange[fullDateRangeIndex] >= data.tradeTimes[index]) {
        fullTradePriceRange[fullDateRangeIndex] = stockValue;
        fullDateRangeIndex++;
      }
    }

    data.tradePrice = fullTradePriceRange;
    data.tradeTimes = fullDateRange;
  }



  private aggregateData(newStockData: TradeData) {

    if (!this.tradeData) {
      this.tradeData = newStockData;
    } else {

      const allDatesArray = this.createUnifiedDateRange(newStockData);
      const aggregatedPrices: number[] = this.calculateNetWorthOverTime(newStockData, allDatesArray);

      const aggregatedTradeData: TradeData = {
        stockSymbol: `${this.tradeData.stockSymbol} & ${newStockData.stockSymbol}`,
        tradeTimes: allDatesArray,
        tradePrice: aggregatedPrices,
        lastPrice: aggregatedPrices[aggregatedPrices.length - 1],
      };

      this.tradeData = aggregatedTradeData;
    }
  }

  private createUnifiedDateRange(newStockData: TradeData) {
    let currentDataLastIndex = this.tradeData!.tradeTimes.length - 1;
    let newDataLastIndex = newStockData.tradeTimes.length - 1;

    const earliestDate = new Date(Math.min(
      new Date(this.tradeData!.tradeTimes[currentDataLastIndex]).getTime(),
      new Date(newStockData.tradeTimes[newDataLastIndex]).getTime()
    ));

    const latestDate = new Date(Math.max(
      new Date(this.tradeData!.tradeTimes[0]).getTime(),
      new Date(newStockData.tradeTimes[0]).getTime()
    ));

    return this.generateDateRange(earliestDate, latestDate);
  }


  private generateDateRange(startDate: Date, endDate: Date): string[] {
    const dateArray: string[] = [];
    let adaptedStartDate = startDate;
    adaptedStartDate.setDate(adaptedStartDate.getDate());
    let currentDate = new Date(adaptedStartDate);

    let adaptedEndDate = endDate;
    adaptedEndDate.setDate(adaptedEndDate.getDate() + 7);

    while (currentDate <= adaptedEndDate) {
      dateArray.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }


  private calculateNetWorthOverTime(newStockData: TradeData, allDatesArray: string[]) {

    const currentPriceMap = this.createPriceMap(this.tradeData!.tradeTimes, this.tradeData!.tradePrice);
    const newStockPriceMap = this.createPriceMap(newStockData.tradeTimes, newStockData.tradePrice);
    const aggregatedPrices: number[] = [];

    allDatesArray.forEach(date => {
      const price1 = currentPriceMap.get(date) || 0;
      const price2 = newStockPriceMap.get(date) || 0;
      aggregatedPrices.push(price1 + price2);
    });

    return aggregatedPrices;
  }

  private createPriceMap(dates: string[], prices: number[]): Map<string, number> {
    const priceMap = new Map<string, number>();
    for (let i = 0; i < dates.length; i++) {
      priceMap.set(dates[i], prices[i]);
    }
    return priceMap;
  }

}
