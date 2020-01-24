import { TestBed } from '@angular/core/testing';

import { ExtraAracBilgiService } from './extra-arac-bilgi.service';

describe('ExtraAracBilgiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExtraAracBilgiService = TestBed.get(ExtraAracBilgiService);
    expect(service).toBeTruthy();
  });
});
