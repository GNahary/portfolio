import { Component, OnInit } from '@angular/core';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { TradeData } from '../../types';
import { PortfolioDataService } from '../services/portfolio-data/portfolio-data.service';

PlotlyModule.plotlyjs = PlotlyJS;


@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [PlotlyModule],
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.css'
})
export class StockChartComponent implements OnInit{

  private graphData: TradeData|null = null;


  constructor(private portfolioDataService:PortfolioDataService){}

  ngOnInit(): void {
    this.portfolioDataService.tradeData$.subscribe(data => {
      if (data) {
        this.graphData = data;
        this.updateGraph();
      }
    });
  }

  updateGraph() {
    this.graph.data[0].x = this.graphData?.tradeTimes;
    this.graph.data[0].y = this.graphData?.tradePrice;
  }

  graph = {
    data: [
      {
        x: this.graphData?.tradeTimes,
        y: this.graphData?.tradePrice,
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
