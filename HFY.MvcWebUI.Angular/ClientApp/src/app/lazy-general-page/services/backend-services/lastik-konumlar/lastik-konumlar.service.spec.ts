import { TestBed } from '@angular/core/testing';

import { LastikKonumlarService } from './lastik-konumlar.service';

describe('LastikKonumlarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastikKonumlarService = TestBed.get(LastikKonumlarService);
    expect(service).toBeTruthy();
  });
});
