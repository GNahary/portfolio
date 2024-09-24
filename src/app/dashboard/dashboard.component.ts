import { Component, OnInit } from '@angular/core';
import { StockTradeService } from '../stock-trade.service';
import { TradeData } from '../../types';
import { StockChartComponent } from "../stock-chart/stock-chart.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StockChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {


  data: TradeData | null = null;
  isLoading: boolean = false;

  constructor(private stockTradeService: StockTradeService) { }

  ngOnInit(): void {
    this.stockTradeService.loadTradingData("TSLA").subscribe((returnedData: TradeData) => this.data = returnedData);
    console.log(this.data);
  }

}
