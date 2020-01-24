import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciYetkiComponent } from './kullanici-yetki.component';

describe('KullaniciYetkiComponent', () => {
  let component: KullaniciYetkiComponent;
  let fixture: ComponentFixture<KullaniciYetkiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KullaniciYetkiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KullaniciYetkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
