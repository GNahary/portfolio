import { Component, Input } from '@angular/core';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;


@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [PlotlyModule],
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
