import { Component, OnInit } from '@angular/core';
import { TradeData } from '../../types';
import { StockChartComponent } from "../stock-chart/stock-chart.component";
import { StockCacheService } from '../stock-cache.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StockChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  stockSymbol = 'TSLA';
  data: TradeData | null = null;
  isLoading: boolean = false;

  constructor(private stockCacheService: StockCacheService) { }

  ngOnInit(): void {
    this.stockCacheService.loadDataFromCache(this.stockSymbol).subscribe(returnedData => this.data = returnedData);
  }

}
