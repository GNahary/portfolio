import { Component, OnInit } from '@angular/core';
import { TradeData } from '../../types';
import { StockChartComponent } from "../stock-chart/stock-chart.component";
import { StockCacheService } from '../stock-cache.service';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormArray, AbstractControl, FormControl, Validators } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StockChartComponent, FormsModule, ReactiveFormsModule, FontAwesomeModule, MatInputModule, MatIconModule, MatButtonModule,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  faTrash = faTrash;

  data: TradeData | null = null;
  isLoading: boolean = false;
  stocksForm: FormGroup;

  constructor(private stockCacheService: StockCacheService, private formBuilder: FormBuilder) {
    this.stocksForm = this.formBuilder.group({
      stocks: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.createNewStock();
    this.addNewStock();
   }


  stocks(): FormArray {
    return this.stocksForm.get("stocks") as FormArray
  }

  createNewStock(): FormGroup {
    return this.formBuilder.group({
      symbol: ['', [Validators.required, Validators.minLength(3)]],
      qty: [undefined, [Validators.min(1)]],
      purchaseDate: [''],
      sellDate: ['']
    })
  }

  addNewStock() {
    this.stocks().push(this.createNewStock());
  }

  removeStock(i: number) {
    this.stocks().removeAt(i);
    this.calculatePortfolio();
  }

  getStock(index: number): FormGroup {
    return this.stocks().at(index) as FormGroup
  }


  calculatePortfolio() {
    console.log(this.stocksForm.value);
    this.data = null;

    this.stocks().controls.forEach(stock => {
      let stockSymbol: string = stock.get("symbol")?.value;

      if (stockSymbol) {
        this.stockCacheService.loadDataFromCache(stockSymbol).subscribe(
          
          returnedData => {
          let stockTradeData = this.calcStockPerformance(stock, returnedData);
          this.aggregateData(stockTradeData!);
        },
        err=>{alert(`Couldn't find data for ${stockSymbol}, please check validity of symbol`)}
      );
  
      }

    });
  }


  private calcStockPerformance(stock: AbstractControl, data: TradeData): TradeData {

    let stockUnits: number = stock.get("qty")?.value as number;
    let stockPurchaseDate: string = stock.get<string>("purchaseDate")?.value;
    let stockSellDate: string = stock.get<string>("sellDate")?.value;

    this.adjustHoldingPeriod(data, stockSellDate, stockPurchaseDate);
    this.calcTotalHoldingValue(stockUnits, data);
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


  private calcTotalHoldingValue(stockUnits: number, data: TradeData) {

    let holdingStartDate = new Date(data.tradeTimes[data.tradeTimes.length - 1]);
    let holdingEndDate = new Date(data.tradeTimes[0]);
    let fullDateRange = this.generateDateRange(holdingStartDate, holdingEndDate).reverse();

    let fullTradePriceRange: number[] = new Array<number>(fullDateRange.length);


    let factor = stockUnits > 1 ? stockUnits : 1;
    let fullDateRangeIndex = 0;
    for (let index = 0; index < data.tradePrice.length; index++) {
      let stockValue = data.tradePrice[index] * factor;
      while (fullDateRangeIndex < fullDateRange.length) {
        if (fullDateRange[fullDateRangeIndex] !== data.tradeTimes[index]) {
          fullTradePriceRange[fullDateRangeIndex] = stockValue;
          fullDateRangeIndex++;
        } else {
          break;
        }
      }

    }

    data.tradePrice = fullTradePriceRange;
    data.tradeTimes = fullDateRange;
  }



  private aggregateData(newStockData: TradeData) {

    if (!this.data) {
      this.data = newStockData;
    } else {

      const allDatesArray = this.createUnifiedDateRange(this.data, newStockData);
      const aggregatedPrices: number[] = this.calculateNetWorthOverTime(this.data, newStockData, allDatesArray);

      const aggregatedTradeData: TradeData = {
        stockSymbol: `${this.data.stockSymbol} & ${newStockData.stockSymbol}`,
        tradeTimes: allDatesArray,
        tradePrice: aggregatedPrices,
        lastPrice: aggregatedPrices[aggregatedPrices.length - 1],
      };

      this.data = aggregatedTradeData;
    }
  }

  private createUnifiedDateRange(data1: TradeData, data2: TradeData) {
    let data1lastIndex = data1.tradeTimes.length - 1;
    let data2lastIndex = data2.tradeTimes.length - 1;

    const earliestDate = new Date(Math.min(
      new Date(data1.tradeTimes[data1lastIndex]).getTime(),
      new Date(data2.tradeTimes[data2lastIndex]).getTime()
    ));

    const latestDate = new Date(Math.max(
      new Date(data1.tradeTimes[0]).getTime(),
      new Date(data2.tradeTimes[0]).getTime()
    ));

    return this.generateDateRange(earliestDate, latestDate);
  }


  private generateDateRange(startDate: Date, endDate: Date): string[] {
    const dateArray: string[] = [];
    let adaptedStartDate = startDate;
    adaptedStartDate.setDate(adaptedStartDate.getDate() - 7);
    let currentDate = new Date(adaptedStartDate);

    let adaptedEndDate = endDate;
    adaptedEndDate.setDate(adaptedEndDate.getDate() + 7);

    while (currentDate <= adaptedEndDate) {
      dateArray.push(currentDate.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return dateArray;
  }


  private calculateNetWorthOverTime(data1: TradeData, data2: TradeData, allDatesArray: string[]) {
    const tradePriceMap1 = this.createPriceMap(data1.tradeTimes, data1.tradePrice);
    const tradePriceMap2 = this.createPriceMap(data2.tradeTimes, data2.tradePrice);

    const aggregatedPrices: number[] = [];

    allDatesArray.forEach(date => {
      const price1 = tradePriceMap1.get(date) || 0;
      const price2 = tradePriceMap2.get(date) || 0;
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
