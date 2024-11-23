import { Component, Input, OnInit } from '@angular/core';
import { PerformanceStatisticsService } from '../services/performance-statistics/performance-statistics.service';
import { PortfolioDataService } from '../services/portfolio-data/portfolio-data.service';
import { TradeData } from '../../types';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {


  @Input() totalAddedFunds: number = 0;
  @Input() totalRetrievedFunds: number = 0;

  private graphData: TradeData|null = null;


  private highestPrice: { value: number, date: string } = {
    value: 0,
    date: ''
  };

  private lowestPrice: { value: number, date: string } = {
    value: 0,
    date: ''
  };

  constructor(private perfStatService: PerformanceStatisticsService, private portfolioDataService:PortfolioDataService) { }


  ngOnInit(): void {
    this.portfolioDataService.tradeData$.subscribe(data => {
      if (data) {
        this.graphData = data;

        this.highestPrice = this.perfStatService.findHighestPrice(this.graphData?.tradePrice!, this.graphData?.tradeTimes!);
        this.lowestPrice = this.perfStatService.findLowestPrice(this.graphData?.tradePrice!, this.graphData?.tradeTimes!);
      }
    });
  }


  calcTotalPerformancePercentage(): number {
    return this.perfStatService.calcTotalPerformancePercentage(this.totalAddedFunds, this.totalRetrievedFunds);
  }

  calcTotalPerformance(): number {
    return this.perfStatService.calcTotalPerformance(this.totalAddedFunds, this.totalRetrievedFunds);
  }


  findHighestPrice(): number {
    return this.highestPrice.value;
  }

  findHighestPriceDate(): string {
    return this.highestPrice.date;
  }

  findLowestPrice(): number {
    return this.lowestPrice.value;
  }

  findLowestPriceDate(): string {
    return this.lowestPrice.date;
  }

}
