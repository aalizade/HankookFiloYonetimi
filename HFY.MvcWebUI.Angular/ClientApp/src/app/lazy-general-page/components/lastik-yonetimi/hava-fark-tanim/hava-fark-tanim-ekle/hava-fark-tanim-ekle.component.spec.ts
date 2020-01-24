import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavaFarkTanimEkleComponent } from './hava-fark-tanim-ekle.component';

describe('HavaFarkTanimEkleComponent', () => {
  let component: HavaFarkTanimEkleComponent;
  let fixture: ComponentFixture<HavaFarkTanimEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavaFarkTanimEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavaFarkTanimEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
