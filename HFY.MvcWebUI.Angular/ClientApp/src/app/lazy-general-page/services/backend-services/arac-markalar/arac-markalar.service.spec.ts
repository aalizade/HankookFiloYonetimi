import { TestBed } from '@angular/core/testing';

import { AracMarkalarService } from './arac-markalar.service';

describe('AracMarkalarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AracMarkalarService = TestBed.get(AracMarkalarService);
    expect(service).toBeTruthy();
  });
});
