import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AKOlcumleComponent } from './a-k-olcumle.component';

describe('AKOlcumleComponent', () => {
  let component: AKOlcumleComponent;
  let fixture: ComponentFixture<AKOlcumleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AKOlcumleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AKOlcumleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
