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
    return totalRetrievedFunds - totalAddedFunds;
  }

  findHighestPrice(priceValues: number[], dateValues: string[]): { value: number, date: string } {
    
    let maxIndex = 0;
    let maxPrice = priceValues[0];
    for (let index = 0; index < priceValues.length; index++) {
      let currentPrice = priceValues[index];
      if (currentPrice && maxPrice < currentPrice) {
        maxIndex = index;
          maxPrice = currentPrice;
      }
    }

    return { value: priceValues[maxIndex], date: dateValues[maxIndex] };
  }

  findLowestPrice(priceValues: number[], dateValues: string[]): { value: number, date: string } {
    let minIndex = 0;
    let minPrice = priceValues[0];
    for (let index = 0; index < priceValues.length; index++) {
      let currentPrice = priceValues[index];
      if (currentPrice && minPrice > currentPrice) {
          minIndex = index;
          minPrice = currentPrice;
      }
    }

    return { value: priceValues[minIndex], date: dateValues[minIndex] };
  }
}
