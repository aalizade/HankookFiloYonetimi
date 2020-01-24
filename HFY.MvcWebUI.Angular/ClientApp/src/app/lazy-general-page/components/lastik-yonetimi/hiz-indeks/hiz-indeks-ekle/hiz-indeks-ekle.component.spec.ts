import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HizIndeksEkleComponent } from './hiz-indeks-ekle.component';

describe('HizIndeksEkleComponent', () => {
  let component: HizIndeksEkleComponent;
  let fixture: ComponentFixture<HizIndeksEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HizIndeksEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HizIndeksEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
