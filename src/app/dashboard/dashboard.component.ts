import { Component, OnInit } from '@angular/core';
import { TradeData } from '../../types';
import { StockChartComponent } from "../stock-chart/stock-chart.component";
import { StockCacheService } from '../stock-cache.service';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms'



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
      qty: [''],
      date: ['']
    })
  }

  addStock() {
    this.stocks().push(this.newStock());
  }

  removeStock(i: number) {
    this.stocks().removeAt(i);
    this.calculatePortfolio();
  }


  calculatePortfolio() {
    console.log(this.stocksForm.value);
    this.data = null;

    this.stocks().controls.forEach(stock => {
      let stockSymbol: string = stock.get<string>("symbol")?.value;
      console.log("Data for " + stockSymbol);
      this.stockCacheService.loadDataFromCache(stockSymbol).subscribe(returnedData => {
        console.log("Returned Data is " + returnedData!.lastPrice);
        this.aggregateData(returnedData!);
      });

    });

  }


  private aggregateData(data: TradeData) {

    console.log(" aggregateData for " + data.stockSymbol);

    if (!this.data) {
      console.log(`Null Data, adding ${data.stockSymbol}`);
      this.data = data;
    } else {

      console.log(`Data consist of ${this.data.stockSymbol} with trade price of ${this.data?.tradePrice[0]}, adding ${data?.tradePrice[0]}`);
      for (let index = 0; index < data.tradePrice.length; index++) {
        this.data.tradePrice[index] += data.tradePrice[index];
      }

      console.log(`Aggregated data is now ${this.data?.tradePrice[0]}`);
    }
  }

}
