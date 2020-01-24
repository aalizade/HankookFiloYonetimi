import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbatEkleComponent } from './ebat-ekle.component';

describe('EbatEkleComponent', () => {
  let component: EbatEkleComponent;
  let fixture: ComponentFixture<EbatEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbatEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbatEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
