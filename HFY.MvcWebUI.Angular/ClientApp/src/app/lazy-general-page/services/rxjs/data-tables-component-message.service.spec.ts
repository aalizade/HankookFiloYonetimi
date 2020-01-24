/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataTablesComponentMessageService } from './data-tables-component-message.service';

describe('Service: DataTablesComponentMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataTablesComponentMessageService]
    });
  });

  it('should ...', inject([DataTablesComponentMessageService], (service: DataTablesComponentMessageService) => {
    expect(service).toBeTruthy();
  }));
});
