import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AksPozisyonEkleComponent } from './aks-pozisyon-ekle.component';

describe('AksPozisyonEkleComponent', () => {
  let component: AksPozisyonEkleComponent;
  let fixture: ComponentFixture<AksPozisyonEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AksPozisyonEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AksPozisyonEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
