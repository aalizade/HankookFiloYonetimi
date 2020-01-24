import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LBOlcumleComponent } from './l-b-olcumle.component';

describe('LBOlcumleComponent', () => {
  let component: LBOlcumleComponent;
  let fixture: ComponentFixture<LBOlcumleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LBOlcumleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LBOlcumleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
