import { Component, OnInit } from '@angular/core';
import { TradeData } from '../../types';
import { StockCacheService } from '../services/stock-cache/stock-cache.service';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormArray, AbstractControl, Validators } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { PortfolioDataService } from '../services/portfolio-data/portfolio-data.service';
import { StockChartComponent } from "../stock-chart/stock-chart.component";
import { StatisticsComponent } from "../statistics/statistics.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule, MatInputModule, MatIconModule, MatButtonModule, StockChartComponent, StatisticsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  faTrash = faTrash;

  data: TradeData | null = null;
  isLoading: boolean = false;
  stocksForm: FormGroup;

  totalAddedFunds:number = 0;
  totalRetrievedFunds:number = 0;

  constructor(private stockCacheService: StockCacheService, private formBuilder: FormBuilder, private portfolioDataService:PortfolioDataService) {
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

    this.portfolioDataService.updateTradeData(this.data!!);
  }


  private calcStockPerformance(stock: AbstractControl, data: TradeData): TradeData {
    this.totalAddedFunds=0;
    this.totalRetrievedFunds=0;

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


  private aggregateOverallStockPerformance(stockUnits: number, data: TradeData){
    let factor = stockUnits > 1 ? stockUnits : 1;

    this.totalRetrievedFunds += data.lastPrice * factor;    

    let addedFundsIndex = data.tradePrice.length -1;
    for (; addedFundsIndex > 0; addedFundsIndex--) {
      let tradePrice = data.tradePrice[addedFundsIndex];
      if(tradePrice){
        this.totalAddedFunds += tradePrice * factor;
        break;
      } 
    }
  }


  private calcTotalHoldingValue(stockUnits: number, data: TradeData) {

    let holdingStartDate = new Date(data.tradeTimes[data.tradeTimes.length - 1]);    
    let holdingEndDate = new Date(data.tradeTimes[0]);
    let fullDateRange = this.generateDateRange(holdingStartDate, holdingEndDate).reverse();

    console.log("Date range start:" + fullDateRange[fullDateRange.length-1]);


    let fullTradePriceRange: number[] = new Array<number>(fullDateRange.length);


    // There is a bug here!
    let factor = stockUnits > 1 ? stockUnits : 1;
    let fullDateRangeIndex = 0;
    for (let index = 0; index < data.tradePrice.length; index++) {
      let stockValue = data.tradePrice[index] * factor;

      // fill with the right price
      while(fullDateRange[fullDateRangeIndex] >= data.tradeTimes[index]){
        fullTradePriceRange[fullDateRangeIndex] = stockValue;
        fullDateRangeIndex++;
      }
    }

    data.tradePrice = fullTradePriceRange;
    data.tradeTimes = fullDateRange;

    console.log(`holding: ${data.tradeTimes[data.tradeTimes.length - 1]}: ${data.tradePrice[data.tradePrice.length - 1]}  ${data.tradePrice.length}`);
    
  }



  private aggregateData(newStockData: TradeData) {

    if (!this.data) {
      this.data = newStockData;
    } else {

      const allDatesArray = this.createUnifiedDateRange(newStockData);
      const aggregatedPrices: number[] = this.calculateNetWorthOverTime(newStockData, allDatesArray);

      const aggregatedTradeData: TradeData = {
        stockSymbol: `${this.data.stockSymbol} & ${newStockData.stockSymbol}`,
        tradeTimes: allDatesArray,
        tradePrice: aggregatedPrices,
        lastPrice: aggregatedPrices[aggregatedPrices.length - 1],
      };

      this.data = aggregatedTradeData;
    }
  }

  private createUnifiedDateRange(newStockData: TradeData) {
    let currentDataLastIndex = this.data!.tradeTimes.length - 1;
    let newDataLastIndex = newStockData.tradeTimes.length - 1;

    const earliestDate = new Date(Math.min(
      new Date(this.data!.tradeTimes[currentDataLastIndex]).getTime(),
      new Date(newStockData.tradeTimes[newDataLastIndex]).getTime()
    ));

    const latestDate = new Date(Math.max(
      new Date(this.data!.tradeTimes[0]).getTime(),
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

    console.log(`current start ${this.data!.tradeTimes[0]}`);
    console.log(`added start ${newStockData.tradeTimes[0]}`);


    const currentPriceMap = this.createPriceMap(this.data!.tradeTimes, this.data!.tradePrice);
    const newStockPriceMap = this.createPriceMap(newStockData.tradeTimes, newStockData.tradePrice);

    console.log(`current ${this.data!.tradePrice[0]}`);
    console.log(`added ${newStockData.tradePrice[0]}`);
    

    const aggregatedPrices: number[] = [];

    allDatesArray.forEach(date => {
      const price1 = currentPriceMap.get(date) || 0;
      const price2 = newStockPriceMap.get(date) || 0;
      aggregatedPrices.push(price1 + price2);
    });

    console.log(` After aggregatedPrices ${aggregatedPrices[0]}`);
    

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
