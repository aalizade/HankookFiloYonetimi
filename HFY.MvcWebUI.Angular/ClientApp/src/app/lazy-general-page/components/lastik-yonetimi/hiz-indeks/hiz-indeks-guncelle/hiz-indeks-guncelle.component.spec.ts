import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HizIndeksGuncelleComponent } from './hiz-indeks-guncelle.component';

describe('HizIndeksGuncelleComponent', () => {
  let component: HizIndeksGuncelleComponent;
  let fixture: ComponentFixture<HizIndeksGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HizIndeksGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HizIndeksGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
