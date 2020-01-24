import { TestBed } from '@angular/core/testing';

import { AracModellerService } from './arac-modeller.service';

describe('AracModellerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AracModellerService = TestBed.get(AracModellerService);
    expect(service).toBeTruthy();
  });
});
