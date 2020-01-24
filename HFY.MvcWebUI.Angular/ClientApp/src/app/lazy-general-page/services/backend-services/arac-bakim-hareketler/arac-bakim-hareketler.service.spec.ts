import { TestBed } from '@angular/core/testing';

import { AracBakimHareketlerService } from './arac-bakim-hareketler.service';

describe('AracBakimHareketlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AracBakimHareketlerService = TestBed.get(AracBakimHareketlerService);
    expect(service).toBeTruthy();
  });
});
