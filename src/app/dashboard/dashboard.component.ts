import { Component, OnInit } from '@angular/core';
import { TradeData } from '../../types';
import { StockChartComponent } from "../stock-chart/stock-chart.component";
import { StockCacheService } from '../stock-cache.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StockChartComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  data: TradeData | null = null;
  isLoading: boolean = false;

  constructor(private stockCacheService: StockCacheService) { }

  ngOnInit(): void { }


  searchForStock(stockSymbol1: string, stockSymbol2: string) {
    this.data = null;
    console.log("Data for " + stockSymbol1);
    let stock1Data: TradeData | null = null;
    this.stockCacheService.loadDataFromCache(stockSymbol1).subscribe(returnedData => stock1Data = returnedData);
    console.log("Returned Data is " + stock1Data!.lastPrice);
    this.aggregateData(stock1Data!);

    console.log("Data for " + stockSymbol2);
    let stock2Data: TradeData | null = null;
    this.stockCacheService.loadDataFromCache(stockSymbol2).subscribe(returnedData => stock2Data = returnedData);
    this.aggregateData(stock2Data!);
  }

  private aggregateData(data: TradeData) {

    if (!this.data) {
      this.data = data;
    } else {
      for (let index = 0; index < data.tradePrice.length; index++) {
        console.log(" Index saved Data is " + this.data?.tradePrice[index]);
        console.log(" Index new Data is " + data?.tradePrice[index]);
        this.data.tradePrice[index] += data.tradePrice[index];
      }
    }
  }

}
