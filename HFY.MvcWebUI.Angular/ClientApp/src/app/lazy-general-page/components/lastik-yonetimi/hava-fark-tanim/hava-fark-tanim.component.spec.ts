import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavaFarkTanimComponent } from './hava-fark-tanim.component';

describe('HavaFarkTanimComponent', () => {
  let component: HavaFarkTanimComponent;
  let fixture: ComponentFixture<HavaFarkTanimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavaFarkTanimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavaFarkTanimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
