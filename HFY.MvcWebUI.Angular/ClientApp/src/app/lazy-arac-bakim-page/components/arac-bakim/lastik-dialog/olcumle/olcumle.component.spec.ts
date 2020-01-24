import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlcumleComponent } from './olcumle.component';

describe('OlcumleComponent', () => {
  let component: OlcumleComponent;
  let fixture: ComponentFixture<OlcumleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlcumleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlcumleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
