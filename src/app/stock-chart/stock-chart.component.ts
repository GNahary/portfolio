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

  @Input()
  set graphSymbol(symbol: string) {
    this.graph.layout.title = `${symbol} Stock History`;
  }

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
      width: 900,
      height: 400,
      title: "",
    }
  }
}
