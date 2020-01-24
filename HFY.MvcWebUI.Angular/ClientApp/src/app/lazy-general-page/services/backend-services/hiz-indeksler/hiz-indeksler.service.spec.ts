import { TestBed } from '@angular/core/testing';

import { HizIndekslerService } from './hiz-indeksler.service';

describe('HizIndekslerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HizIndekslerService = TestBed.get(HizIndekslerService);
    expect(service).toBeTruthy();
  });
});
