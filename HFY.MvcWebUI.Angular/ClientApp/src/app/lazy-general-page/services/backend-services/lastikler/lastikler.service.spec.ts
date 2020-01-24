import { TestBed } from '@angular/core/testing';

import { LastiklerService } from './lastikler.service';

describe('LastiklerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastiklerService = TestBed.get(LastiklerService);
    expect(service).toBeTruthy();
  });
});
