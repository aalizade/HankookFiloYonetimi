import { TestBed } from '@angular/core/testing';

import { LastikOlcumlerService } from './lastik-olcumler.service';

describe('LastikOlcumlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastikOlcumlerService = TestBed.get(LastikOlcumlerService);
    expect(service).toBeTruthy();
  });
});
