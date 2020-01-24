import { TestBed } from '@angular/core/testing';

import { AksPozisyonlarService } from './aks-pozisyonlar.service';

describe('AksPozisyonlarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AksPozisyonlarService = TestBed.get(AksPozisyonlarService);
    expect(service).toBeTruthy();
  });
});
