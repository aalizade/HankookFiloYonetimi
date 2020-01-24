import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AracKategoriEkleComponent } from './arac-kategori-ekle.component';

describe('AracKategoriEkleComponent', () => {
  let component: AracKategoriEkleComponent;
  let fixture: ComponentFixture<AracKategoriEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AracKategoriEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AracKategoriEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
