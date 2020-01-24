import { TestBed } from '@angular/core/testing';

import { LastikTurlerService } from './lastik-turler.service';

describe('LastikTurlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastikTurlerService = TestBed.get(LastikTurlerService);
    expect(service).toBeTruthy();
  });
});
