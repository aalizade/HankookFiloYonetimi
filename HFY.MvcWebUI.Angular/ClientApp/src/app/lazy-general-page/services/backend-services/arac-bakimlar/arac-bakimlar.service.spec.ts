import { TestBed } from '@angular/core/testing';

import { AracBakimlarService } from './arac-bakimlar.service';

describe('AracBakimlarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AracBakimlarService = TestBed.get(AracBakimlarService);
    expect(service).toBeTruthy();
  });
});
