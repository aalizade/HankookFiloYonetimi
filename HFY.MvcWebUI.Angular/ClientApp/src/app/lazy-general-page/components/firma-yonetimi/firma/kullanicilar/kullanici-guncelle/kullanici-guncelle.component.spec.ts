import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciGuncelleComponent } from './kullanici-guncelle.component';

describe('KullaniciGuncelleComponent', () => {
  let component: KullaniciGuncelleComponent;
  let fixture: ComponentFixture<KullaniciGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KullaniciGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KullaniciGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
