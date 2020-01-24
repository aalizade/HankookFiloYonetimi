import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracKategoriGuncelleComponent } from './arac-kategori-guncelle.component';

describe('AracKategoriGuncelleComponent', () => {
  let component: AracKategoriGuncelleComponent;
  let fixture: ComponentFixture<AracKategoriGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracKategoriGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracKategoriGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
