import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PerformanceStatisticsService } from '../services/performance-statistics/performance-statistics.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnChanges {


  @Input() totalAddedFunds: number = 0;
  @Input() totalRetrievedFunds: number = 0;

  @Input() dateValues: string[] = [];
  @Input() priceValues: number[] = [];

  private highestPrice: { value: number, date: string } = {
    value: 0,
    date: ''
  };

  private lowestPrice: { value: number, date: string } = {
    value: 0,
    date: ''
  };

  constructor(private perfStatService: PerformanceStatisticsService) { }

  ngOnChanges(): void {
    this.highestPrice = this.perfStatService.findHighestPrice(this.priceValues, this.dateValues);
    this.lowestPrice = this.perfStatService.findLowestPrice(this.priceValues, this.dateValues);
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
