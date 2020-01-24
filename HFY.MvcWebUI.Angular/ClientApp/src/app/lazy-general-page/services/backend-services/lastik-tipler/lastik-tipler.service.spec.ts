import { TestBed } from '@angular/core/testing';

import { LastikTiplerService } from './lastik-tipler.service';

describe('LastikTiplerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastikTiplerService = TestBed.get(LastikTiplerService);
    expect(service).toBeTruthy();
  });
});
