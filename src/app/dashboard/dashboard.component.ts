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

  searchForStock(stockSymbol: string) {
    this.stockCacheService.loadDataFromCache(stockSymbol).subscribe(returnedData => this.data = returnedData);
  }

}
