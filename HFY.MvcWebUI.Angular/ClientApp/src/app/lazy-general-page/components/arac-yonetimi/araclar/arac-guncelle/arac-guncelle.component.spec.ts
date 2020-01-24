import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracGuncelleComponent } from './arac-guncelle.component';

describe('AracGuncelleComponent', () => {
  let component: AracGuncelleComponent;
  let fixture: ComponentFixture<AracGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
