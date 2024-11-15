import { Component, Input } from '@angular/core';
import { StockChartComponent } from "../stock-chart/stock-chart.component";
import { StatisticsComponent } from "../statistics/statistics.component";

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [StockChartComponent, StatisticsComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {

  @Input() dates:string[]=[];
  @Input() prices: number[]=[];

  @Input() totalAddedFunds:number=0;
  @Input() totalRetrievedFunds:number=0;

}
