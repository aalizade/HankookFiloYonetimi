import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaEkleComponent } from './firma-ekle.component';

describe('FirmaEkleComponent', () => {
  let component: FirmaEkleComponent;
  let fixture: ComponentFixture<FirmaEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmaEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmaEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
