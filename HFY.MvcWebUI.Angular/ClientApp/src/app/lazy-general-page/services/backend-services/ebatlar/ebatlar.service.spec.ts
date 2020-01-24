import { TestBed } from '@angular/core/testing';

import { EbatlarService } from './ebatlar.service';

describe('EbatlarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EbatlarService = TestBed.get(EbatlarService);
    expect(service).toBeTruthy();
  });
});
