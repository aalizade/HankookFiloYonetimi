import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YukIndeksGuncelleComponent } from './yuk-indeks-guncelle.component';

describe('YukIndeksGuncelleComponent', () => {
  let component: YukIndeksGuncelleComponent;
  let fixture: ComponentFixture<YukIndeksGuncelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YukIndeksGuncelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YukIndeksGuncelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
