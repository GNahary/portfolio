import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {


  @Input() totalAddedFunds: number = 0;
  @Input() totalRetrievedFunds: number = 0;

  @Input() dateValues: string[] = [];
  @Input() priceValues: number[] = [];



  calcTotalPerformance(): number {
    return ((this.totalRetrievedFunds / this.totalAddedFunds - 1) * 100);
  }


  findHighestPrice(){
    return this.priceValues[this.findHighestValueIndex()];
  }

  findHighestPriceDate(){
    return this.dateValues[this.findHighestValueIndex()];
  }

  findLowestPrice(){
    return this.priceValues[this.findLowestValueIndex()];
  }

  findLowestPriceDate(){
    return this.dateValues[this.findLowestValueIndex()];
  }


  private findHighestValueIndex(): number {
    const index = this.priceValues.reduce((maxIndex, currentValue, currentIndex, array) =>
      currentValue > array[maxIndex] ? currentIndex : maxIndex,
      0 
    );
    return index;
  }

  private findLowestValueIndex(): number {
    const index = this.priceValues.reduce((minIndex, currentValue, currentIndex, array) =>
      currentValue < array[minIndex] ? currentIndex : minIndex,
      0 
    );
    return index;
  }

}
