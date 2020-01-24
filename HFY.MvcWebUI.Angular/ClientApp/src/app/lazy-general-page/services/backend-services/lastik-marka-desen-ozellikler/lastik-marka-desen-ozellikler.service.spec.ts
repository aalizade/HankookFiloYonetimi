import { TestBed } from '@angular/core/testing';

import { LastikMarkaDesenOzelliklerService } from './lastik-marka-desen-ozellikler.service';

describe('LastikMarkaDesenOzelliklerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastikMarkaDesenOzelliklerService = TestBed.get(LastikMarkaDesenOzelliklerService);
    expect(service).toBeTruthy();
  });
});
