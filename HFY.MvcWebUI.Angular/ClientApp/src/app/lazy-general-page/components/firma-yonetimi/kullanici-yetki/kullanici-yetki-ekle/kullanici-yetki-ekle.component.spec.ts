import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciYetkiEkleComponent } from './kullanici-yetki-ekle.component';

describe('KullaniciYetkiEkleComponent', () => {
  let component: KullaniciYetkiEkleComponent;
  let fixture: ComponentFixture<KullaniciYetkiEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KullaniciYetkiEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KullaniciYetkiEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
