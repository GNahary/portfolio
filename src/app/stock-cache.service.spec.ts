import { TestBed } from '@angular/core/testing';

import { StockCacheService } from './stock-cache.service';

describe('StockCacheService', () => {
  let service: StockCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
