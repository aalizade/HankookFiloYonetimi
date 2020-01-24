import { TestBed } from '@angular/core/testing';

import { YukIndekslerService } from './yuk-indeksler.service';

describe('YukIndekslerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YukIndekslerService = TestBed.get(YukIndekslerService);
    expect(service).toBeTruthy();
  });
});
