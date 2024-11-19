import { TestBed } from '@angular/core/testing';

import { PerformanceStatisticsService } from './performance-statistics.service';

describe('PerformanceStatisticsService', () => {
  let service: PerformanceStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformanceStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
