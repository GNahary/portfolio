import { Component, Input } from '@angular/core';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { StatisticsComponent } from "../statistics/statistics.component";

PlotlyModule.plotlyjs = PlotlyJS;


@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [PlotlyModule, StatisticsComponent],
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.css'
})
export class StockChartComponent {

  @Input()
  set xValues(values: string[]) {
    this.graph.data[0].x = values;
  };
  @Input()
  set yValues(values: number[]) {
    this.graph.data[0].y = values;

  };

  @Input() totalAddedFunds:number=0;
  @Input() totalRetrievedFunds:number=0;


  graph = {
    data: [
      {
        x: this.xValues,
        y: this.yValues,
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'green' },
      }
    ],
    layout: {
      width: window.innerWidth * 0.75,
      height: window.innerHeight * 0.75,
      title: "",
    }
  }
}
