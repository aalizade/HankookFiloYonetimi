import { TestBed } from '@angular/core/testing';

import { HavaFarkTanimlarService } from './hava-fark-tanimlar.service';

describe('HavaFarkTanimlarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HavaFarkTanimlarService = TestBed.get(HavaFarkTanimlarService);
    expect(service).toBeTruthy();
  });
});
