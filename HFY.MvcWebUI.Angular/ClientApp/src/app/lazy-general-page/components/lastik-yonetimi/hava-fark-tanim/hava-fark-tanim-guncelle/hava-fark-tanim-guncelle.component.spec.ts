import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavaFarkTanimGuncelleComponent } from './hava-fark-tanim-guncelle.component';

describe('HavaFarkTanimGuncelleComponent', () => {
  let component: HavaFarkTanimGuncelleComponent;
  let fixture: ComponentFixture<HavaFarkTanimGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavaFarkTanimGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavaFarkTanimGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
