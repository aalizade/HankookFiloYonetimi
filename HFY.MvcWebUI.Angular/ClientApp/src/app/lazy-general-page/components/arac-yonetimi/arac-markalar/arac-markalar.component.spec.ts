import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracMarkalarComponent } from './arac-markalar.component';

describe('AracMarkalarComponent', () => {
  let component: AracMarkalarComponent;
  let fixture: ComponentFixture<AracMarkalarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracMarkalarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracMarkalarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
