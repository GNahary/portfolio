import { TestBed } from '@angular/core/testing';
import { StockTradeService } from './stock-trade.service';


describe('StockTradeService', () => {
  let service: StockTradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockTradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
