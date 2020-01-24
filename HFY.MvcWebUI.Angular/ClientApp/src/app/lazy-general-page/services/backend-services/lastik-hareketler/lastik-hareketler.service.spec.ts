import { TestBed } from '@angular/core/testing';

import { LastikHareketlerService } from './lastik-hareketler.service';

describe('LastikHareketlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastikHareketlerService = TestBed.get(LastikHareketlerService);
    expect(service).toBeTruthy();
  });
});
