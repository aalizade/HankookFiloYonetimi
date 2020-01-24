import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YukIndeksEkleComponent } from './yuk-indeks-ekle.component';

describe('YukIndeksEkleComponent', () => {
  let component: YukIndeksEkleComponent;
  let fixture: ComponentFixture<YukIndeksEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YukIndeksEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YukIndeksEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
