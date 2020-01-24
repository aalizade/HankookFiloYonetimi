import { TestBed } from '@angular/core/testing';

import { KullanicilarService } from './kullanicilar.service';

describe('KullanicilarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KullanicilarService = TestBed.get(KullanicilarService);
    expect(service).toBeTruthy();
  });
});
