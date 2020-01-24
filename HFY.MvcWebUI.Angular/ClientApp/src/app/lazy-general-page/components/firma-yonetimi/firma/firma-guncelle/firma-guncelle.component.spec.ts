import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaGuncelleComponent } from './firma-guncelle.component';

describe('FirmaGuncelleComponent', () => {
  let component: FirmaGuncelleComponent;
  let fixture: ComponentFixture<FirmaGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmaGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmaGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
