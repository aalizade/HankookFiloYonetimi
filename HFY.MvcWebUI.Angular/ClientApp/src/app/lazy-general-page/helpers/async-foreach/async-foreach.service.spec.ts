import { TestBed } from '@angular/core/testing';

import { AsyncForeachService } from './async-foreach.service';

describe('AsyncForeachService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsyncForeachService = TestBed.get(AsyncForeachService);
    expect(service).toBeTruthy();
  });
});
