import { TestBed } from '@angular/core/testing';

import { ParaBirimlerService } from './para-birimler.service';

describe('ParaBirimlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParaBirimlerService = TestBed.get(ParaBirimlerService);
    expect(service).toBeTruthy();
  });
});
