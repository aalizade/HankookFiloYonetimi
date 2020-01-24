import { TestBed } from '@angular/core/testing';

import { AksDuzenlerService } from './aks-duzenler.service';

describe('AksDuzenlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AksDuzenlerService = TestBed.get(AksDuzenlerService);
    expect(service).toBeTruthy();
  });
});
