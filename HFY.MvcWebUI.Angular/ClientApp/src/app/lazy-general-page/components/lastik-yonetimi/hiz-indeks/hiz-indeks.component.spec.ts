import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HizIndeksComponent } from './hiz-indeks.component';

describe('HizIndeksComponent', () => {
  let component: HizIndeksComponent;
  let fixture: ComponentFixture<HizIndeksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HizIndeksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HizIndeksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
