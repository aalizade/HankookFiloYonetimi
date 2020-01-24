import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracModellerComponent } from './arac-modeller.component';

describe('AracModellerComponent', () => {
  let component: AracModellerComponent;
  let fixture: ComponentFixture<AracModellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracModellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracModellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
