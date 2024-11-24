import { Component, OnInit } from '@angular/core';
import { TradeData } from '../../types';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PortfolioDataService } from '../services/portfolio-data/portfolio-data.service';
import { StockChartComponent } from "../stock-chart/stock-chart.component";
import { StatisticsComponent } from "../statistics/statistics.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule, MatInputModule, MatIconModule, MatButtonModule, StockChartComponent, StatisticsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  faTrash = faTrash;
  data: TradeData | null = null;
  isLoading: boolean = false;
  stocksForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private portfolioDataService: PortfolioDataService) {
    this.stocksForm = this.formBuilder.group({
      stocks: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.createNewStock();
    this.addNewStock();

    this.portfolioDataService.tradeData$.subscribe(data => {
      this.data = data;
    }
    );
  }


  stocks(): FormArray {
    return this.stocksForm.get("stocks") as FormArray
  }

  createNewStock(): FormGroup {
    return this.formBuilder.group({
      symbol: ['', [Validators.required, Validators.minLength(3)]],
      qty: [undefined, [Validators.min(1)]],
      purchaseDate: [''],
      sellDate: ['']
    })
  }

  addNewStock() {
    this.stocks().push(this.createNewStock());
  }

  removeStock(i: number) {
    this.stocks().removeAt(i);
    this.calculatePortfolio();
  }

  calculatePortfolio() {
    this.portfolioDataService.calculatePortfolio(this.stocks());
  }

  getStock(index: number): FormGroup {
    return this.stocks().at(index) as FormGroup
  }


  getTotalAddedFunds(): number {
    return this.portfolioDataService.totalAddedFunds;
  }

  getTotalRetrievedFunds(): number {
    return this.portfolioDataService.totalRetrievedFunds;
  }

}
