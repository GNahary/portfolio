import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceStatisticsService {


  calcTotalPerformancePercentage(totalAddedFunds: number, totalRetrievedFunds: number): number {
    return totalAddedFunds > 0 
      ? ((totalRetrievedFunds / totalAddedFunds - 1) * 100) 
      : 0;
  }

  calcTotalPerformance(totalAddedFunds: number, totalRetrievedFunds: number): number {
    return totalRetrievedFunds-totalAddedFunds;
  }

  findHighestPrice(priceValues: number[], dateValues: string[]): { value: number, date: string } {
    const maxIndex = priceValues.reduce((maxIdx, val, idx, arr) => val > arr[maxIdx] ? idx : maxIdx, 0);
    return { value: priceValues[maxIndex], date: dateValues[maxIndex] };
  }

  findLowestPrice(priceValues: number[], dateValues: string[]): { value: number, date: string } {
    const minIndex = priceValues.reduce((minIdx, val, idx, arr) => val < arr[minIdx] ? idx : minIdx, 0);
    return { value: priceValues[minIndex], date: dateValues[minIndex] };
  }
}
