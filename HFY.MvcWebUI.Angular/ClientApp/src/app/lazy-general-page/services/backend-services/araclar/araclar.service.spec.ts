import { TestBed } from '@angular/core/testing';

import { AraclarService } from './araclar.service';

describe('AraclarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AraclarService = TestBed.get(AraclarService);
    expect(service).toBeTruthy();
  });
});
