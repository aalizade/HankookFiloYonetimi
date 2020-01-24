import { TestBed } from '@angular/core/testing';

import { LastikMarkaDesenlerService } from './lastik-marka-desenler.service';

describe('LastikMarkaDesenlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastikMarkaDesenlerService = TestBed.get(LastikMarkaDesenlerService);
    expect(service).toBeTruthy();
  });
});
