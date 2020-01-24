import { TestBed } from '@angular/core/testing';

import { LastikMarkalarService } from './lastik-markalar.service';

describe('LastikMarkalarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastikMarkalarService = TestBed.get(LastikMarkalarService);
    expect(service).toBeTruthy();
  });
});
