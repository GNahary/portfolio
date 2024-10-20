import { Component, OnInit } from '@angular/core';
import { TradeData } from '../../types';
import { StockChartComponent } from "../stock-chart/stock-chart.component";
import { StockCacheService } from '../stock-cache.service';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormArray, AbstractControl } from '@angular/forms'


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StockChartComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  data: TradeData | null = null;
  isLoading: boolean = false;
  stocksForm: FormGroup;

  constructor(private stockCacheService: StockCacheService, private formBuilder: FormBuilder) {
    this.stocksForm = this.formBuilder.group({
      stocks: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void { }


  stocks(): FormArray {
    return this.stocksForm.get("stocks") as FormArray
  }


  newStock(): FormGroup {
    return this.formBuilder.group({
      symbol: [''],
      qty: 1,
      purchaseDate: [''],
      sellDate: ['']
    })
  }

  addStock() {
    this.stocks().push(this.newStock());
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

      this.stockCacheService.loadDataFromCache(stockSymbol).subscribe(returnedData => {
        console.log("Returned Data is " + returnedData!.lastPrice);
        let stockTradeData = this.calcStockValues(stock, returnedData);
        this.aggregateData(stockTradeData!);

      });
    });

  }


  private calcStockValues(stock: AbstractControl, data: TradeData): TradeData {

    let stockUnits: number = stock.get("qty")?.value as number;
    let stockPurchaseDate: string = stock.get<string>("purchaseDate")?.value;
    let stockSellDate: string = stock.get<string>("sellDate")?.value;

    let sellDateIndex = data.tradeTimes.findIndex((date: string) => date === stockSellDate);
    if (sellDateIndex !== -1) {
      data.tradeTimes.splice(0, sellDateIndex);
      data.tradePrice.splice(0, sellDateIndex);
    }

    let purchaseDateIndex = data.tradeTimes.findIndex((date: string) => date === stockPurchaseDate);
    if (purchaseDateIndex !== -1) {
      data.tradeTimes.splice(purchaseDateIndex, data.tradeTimes.length - 1);
      data.tradePrice.splice(purchaseDateIndex, data.tradeTimes.length - 1);
    }

    let factor = stockUnits > 1 ? stockUnits : 1;
    console.log(`${data.stockSymbol} with a factor of ${factor}`);
    for (let index = 0; index < data.tradePrice.length; index++) {
      data.tradePrice[index] *= factor;
    }

    return data;
  }


  private aggregateData(data: TradeData) {

    console.log(" aggregateData for " + data.stockSymbol);

    if (!this.data) {
      this.data = data;
    } else {

      console.log(`Data consist of ${this.data.stockSymbol} with trade price of ${this.data?.tradePrice[0]}, adding ${data?.tradePrice[0]}`);
      for (let index = 0; index < data.tradePrice.length; index++) {
        this.data.tradePrice[index] += (data.tradePrice[index]);
      }

      console.log(`Aggregated data is now ${this.data?.tradePrice[0]}`);
    }
  }

}
