import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit{


  @Input() totalAddedFunds:number=0;
  @Input() totalRetrievedFunds:number=0;

  @Input() dateValues: string[]=[];
  @Input() priceValues: number[]=[];

  ngOnInit(): void {
  }




  private findHighestValueIndex():number | undefined{
    return this.priceValues.indexOf(Math.max.apply(Math, this.priceValues));
  }

  private findLowestValueIndex():number | undefined{
    return this.priceValues.indexOf(Math.min.apply(Math, this.priceValues));
  }

}
