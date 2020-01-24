import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AksPozisyonGuncelleComponent } from './aks-pozisyon-guncelle.component';

describe('AksPozisyonGuncelleComponent', () => {
  let component: AksPozisyonGuncelleComponent;
  let fixture: ComponentFixture<AksPozisyonGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AksPozisyonGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AksPozisyonGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
