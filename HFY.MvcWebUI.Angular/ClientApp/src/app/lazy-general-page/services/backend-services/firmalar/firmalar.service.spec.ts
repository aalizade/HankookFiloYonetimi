import { TestBed } from '@angular/core/testing';

import { FirmalarService } from './firmalar.service';

describe('FirmalarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirmalarService = TestBed.get(FirmalarService);
    expect(service).toBeTruthy();
  });
});
