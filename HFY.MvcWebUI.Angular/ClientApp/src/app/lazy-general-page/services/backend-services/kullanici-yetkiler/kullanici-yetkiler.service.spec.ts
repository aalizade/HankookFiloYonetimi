import { TestBed } from '@angular/core/testing';

import { KullaniciYetkilerService } from './kullanici-yetkiler.service';

describe('KullaniciYetkilerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KullaniciYetkilerService = TestBed.get(KullaniciYetkilerService);
    expect(service).toBeTruthy();
  });
});
