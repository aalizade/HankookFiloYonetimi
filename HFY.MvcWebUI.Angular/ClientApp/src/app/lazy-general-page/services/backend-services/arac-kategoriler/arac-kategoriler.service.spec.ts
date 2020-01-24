import { TestBed } from '@angular/core/testing';

import { AracKategorilerService } from './arac-kategoriler.service';

describe('AracKategorilerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AracKategorilerService = TestBed.get(AracKategorilerService);
    expect(service).toBeTruthy();
  });
});
